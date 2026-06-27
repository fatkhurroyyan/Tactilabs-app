import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export type QuestStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

// Level calculation: level = floor(XP / 500) + 1
const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 500) + 1;
};

export const getQuests = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const quests = await prisma.quest.findMany({
      orderBy: { orderIndex: 'asc' },
    });

    if (!userId) {
      return res.status(200).json({ quests });
    }

    // Get user progress
    const progresses = await prisma.questProgress.findMany({
      where: { studentId: userId },
    });

    const questsWithProgress = quests.map(q => {
      const prog = progresses.find(p => p.questId === q.id);
      return {
        ...q,
        circuitConfig: JSON.parse(q.circuitConfig),
        instructions: JSON.parse(q.instructions),
        progress: prog ? {
          status: prog.status,
          attempts: prog.attempts,
          completedAt: prog.completedAt,
        } : {
          status: 'NOT_STARTED' as QuestStatus,
          attempts: 0,
          completedAt: null,
        },
      };
    });

    return res.status(200).json({ quests: questsWithProgress });
  } catch (error) {
    console.error('Error getting quests:', error);
    return res.status(500).json({ message: 'Gagal mengambil daftar quest' });
  }
};

export const getQuestById = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const quest = await prisma.quest.findUnique({
      where: { id },
    });

    if (!quest) {
      return res.status(404).json({ message: 'Quest tidak ditemukan' });
    }

    let progress = null;
    if (userId) {
      progress = await prisma.questProgress.findUnique({
        where: {
          studentId_questId: {
            studentId: userId,
            questId: id,
          },
        },
      });
    }

    return res.status(200).json({
      quest: {
        ...quest,
        circuitConfig: JSON.parse(quest.circuitConfig),
        instructions: JSON.parse(quest.instructions),
      },
      progress: progress ? {
        status: progress.status,
        attempts: progress.attempts,
        timeSpentSeconds: progress.timeSpentSeconds,
        completedAt: progress.completedAt,
      } : {
        status: 'NOT_STARTED' as QuestStatus,
        attempts: 0,
        timeSpentSeconds: 0,
        completedAt: null,
      },
    });
  } catch (error) {
    console.error('Error getting quest by id:', error);
    return res.status(500).json({ message: 'Gagal mengambil detail quest' });
  }
};

export const startOrUpdateProgress = async (req: AuthenticatedRequest, res: Response) => {
  const { id: questId } = req.params;
  const { status, timeSpentSeconds, sensorDataSnapshot } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Otorisasi gagal' });
  }

  try {
    const quest = await prisma.quest.findUnique({
      where: { id: questId },
    });

    if (!quest) {
      return res.status(404).json({ message: 'Quest tidak ditemukan' });
    }

    // Upsert quest progress
    const existingProgress = await prisma.questProgress.findUnique({
      where: {
        studentId_questId: {
          studentId: userId,
          questId,
        },
      },
    });

    const isNewlyCompleted = status === 'COMPLETED' && (!existingProgress || existingProgress.status !== 'COMPLETED');
    const completedAt = isNewlyCompleted ? new Date() : (existingProgress?.completedAt || null);

    const updatedProgress = await prisma.questProgress.upsert({
      where: {
        studentId_questId: {
          studentId: userId,
          questId,
        },
      },
      update: {
        status,
        attempts: { increment: 1 },
        timeSpentSeconds: { increment: timeSpentSeconds || 0 },
        completedAt,
        sensorDataSnapshot: sensorDataSnapshot ? JSON.stringify(sensorDataSnapshot) : existingProgress?.sensorDataSnapshot,
      },
      create: {
        studentId: userId,
        questId,
        status,
        attempts: 1,
        timeSpentSeconds: timeSpentSeconds || 0,
        completedAt,
        sensorDataSnapshot: sensorDataSnapshot ? JSON.stringify(sensorDataSnapshot) : null,
      },
    });

    let xpGained = 0;
    let newLevel = 1;
    let newXp = 0;
    let badgeEarned: any = null;

    if (isNewlyCompleted) {
      xpGained = quest.xpReward;
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user) {
        newXp = user.xp + xpGained;
        newLevel = calculateLevel(newXp);

        await prisma.user.update({
          where: { id: userId },
          data: {
            xp: newXp,
            level: newLevel,
          },
        });

        // Trigger Badge check for milestone count
        const completedCount = await prisma.questProgress.count({
          where: { studentId: userId, status: 'COMPLETED' },
        });

        // Check if there is a badge matching criteria
        const allBadges = await prisma.badge.findMany();
        for (const b of allBadges) {
          const criteria = JSON.parse(b.criteriaValue);
          let isEligible = false;

          if (b.criteriaType === 'QUEST_COUNT' && completedCount >= (criteria.count || 0)) {
            isEligible = true;
          } else if (b.criteriaType === 'TOPIC_MASTERY' && quest.topic === criteria.topic) {
            // Count quests of this topic
            const topicTotal = await prisma.quest.count({ where: { topic: criteria.topic } });
            const userTopicCompleted = await prisma.questProgress.count({
              where: {
                studentId: userId,
                status: 'COMPLETED',
                quest: { topic: criteria.topic },
              },
            });
            if (userTopicCompleted >= topicTotal) {
              isEligible = true;
            }
          }

          if (isEligible) {
            // Check if already has it
            const existingBadge = await prisma.userBadge.findUnique({
              where: {
                userId_badgeId: {
                  userId,
                  badgeId: b.id,
                },
              },
            });

            if (!existingBadge) {
              badgeEarned = await prisma.userBadge.create({
                data: {
                  userId,
                  badgeId: b.id,
                },
                include: { badge: true },
              });
              break; // Trigger one badge pop-up/reward at a time
            }
          }
        }
      }
    }

    return res.status(200).json({
      message: isNewlyCompleted ? 'Quest berhasil diselesaikan!' : 'Progres berhasil diperbarui',
      progress: {
        ...updatedProgress,
        sensorDataSnapshot: updatedProgress.sensorDataSnapshot ? JSON.parse(updatedProgress.sensorDataSnapshot) : null,
      },
      rewards: isNewlyCompleted ? {
        xpGained,
        newXp,
        newLevel,
        badgeEarned: badgeEarned ? badgeEarned.badge : null,
      } : null,
    });
  } catch (error) {
    console.error('Error starting or updating quest progress:', error);
    return res.status(500).json({ message: 'Gagal memperbarui progres quest' });
  }
};
