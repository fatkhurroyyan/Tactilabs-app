import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getEducatorDashboard = async (req: AuthenticatedRequest, res: Response) => {
  const educatorId = req.user?.id;

  if (!educatorId) {
    return res.status(401).json({ message: 'Otorisasi gagal' });
  }

  try {
    const classes = await prisma.class.findMany({
      where: { educatorId },
      include: {
        members: {
          include: {
            student: {
              include: {
                progress: true,
              },
            },
          },
        },
      },
    });

    let totalStudents = 0;
    const classData = classes.map(c => {
      totalStudents += c.members.length;

      // Calculate class average progress
      let totalCompletedQuests = 0;
      c.members.forEach(m => {
        totalCompletedQuests += m.student.progress.filter(p => p.status === 'COMPLETED').length;
      });

      const avgQuestsCompleted = c.members.length > 0 ? (totalCompletedQuests / c.members.length) : 0;

      return {
        id: c.id,
        name: c.name,
        studentCount: c.members.length,
        avgQuestsCompleted,
      };
    });

    // Find students needing attention (e.g. progress completion < 30% of total quests)
    const totalQuests = await prisma.quest.count();
    const studentsNeedingAttention: any[] = [];

    classes.forEach(c => {
      c.members.forEach(m => {
        const completed = m.student.progress.filter(p => p.status === 'COMPLETED').length;
        const completionRate = totalQuests > 0 ? (completed / totalQuests) * 100 : 0;

        if (completionRate < 30) {
          studentsNeedingAttention.push({
            id: m.student.id,
            name: m.student.name,
            email: m.student.email,
            className: c.name,
            completedQuests: completed,
            completionRate: Math.round(completionRate),
          });
        }
      });
    });

    // Limit to top 5 students needing attention
    const limitedStudentsNeedingAttention = studentsNeedingAttention.slice(0, 5);

    return res.status(200).json({
      summary: {
        classCount: classes.length,
        studentCount: totalStudents,
        totalQuests,
      },
      classes: classData,
      needingAttention: limitedStudentsNeedingAttention,
    });
  } catch (error) {
    console.error('Error in getEducatorDashboard:', error);
    return res.status(500).json({ message: 'Gagal memproses dashboard pendidik' });
  }
};

export const getClasses = async (req: AuthenticatedRequest, res: Response) => {
  const educatorId = req.user?.id;

  if (!educatorId) {
    return res.status(401).json({ message: 'Otorisasi gagal' });
  }

  try {
    const classes = await prisma.class.findMany({
      where: { educatorId },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });

    return res.status(200).json({ classes });
  } catch (error) {
    console.error('Error getting classes:', error);
    return res.status(500).json({ message: 'Gagal mengambil data kelas' });
  }
};

export const getClassById = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const educatorId = req.user?.id;

  if (!educatorId) {
    return res.status(401).json({ message: 'Otorisasi gagal' });
  }

  try {
    const cls = await prisma.class.findFirst({
      where: { id, educatorId },
      include: {
        members: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
                xp: true,
                level: true,
                progress: {
                  select: {
                    questId: true,
                    status: true,
                    completedAt: true,
                  },
                },
              },
            },
          },
        },
        assignments: {
          include: {
            quest: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    if (!cls) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' });
    }

    const students = cls.members.map(m => {
      const completedCount = m.student.progress.filter(p => p.status === 'COMPLETED').length;
      return {
        id: m.student.id,
        name: m.student.name,
        email: m.student.email,
        xp: m.student.xp,
        level: m.student.level,
        completedQuests: completedCount,
        progress: m.student.progress,
      };
    });

    return res.status(200).json({
      class: {
        id: cls.id,
        name: cls.name,
        inviteCode: cls.inviteCode,
      },
      students,
      assignments: cls.assignments,
    });
  } catch (error) {
    console.error('Error getting class details:', error);
    return res.status(500).json({ message: 'Gagal mengambil detail kelas' });
  }
};

export const assignQuest = async (req: AuthenticatedRequest, res: Response) => {
  const educatorId = req.user?.id;
  const { classId, questId, deadline } = req.body;

  if (!educatorId) {
    return res.status(401).json({ message: 'Otorisasi gagal' });
  }

  if (!classId || !questId || !deadline) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  try {
    const assignment = await prisma.assignment.create({
      data: {
        classId,
        questId,
        educatorId,
        deadline: new Date(deadline),
      },
    });

    return res.status(201).json({
      message: 'Quest berhasil ditugaskan ke kelas',
      assignment,
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return res.status(500).json({ message: 'Gagal membuat penugasan' });
  }
};

export const createClass = async (req: AuthenticatedRequest, res: Response) => {
  const educatorId = req.user?.id;
  const { name } = req.body;

  if (!educatorId) {
    return res.status(401).json({ message: 'Otorisasi gagal' });
  }

  if (!name) {
    return res.status(400).json({ message: 'Nama kelas wajib diisi' });
  }

  try {
    // Generate code: rand 6 chars
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Check if institution is active on user
    const user = await prisma.user.findUnique({
      where: { id: educatorId },
    });

    if (!user || !user.institutionId) {
      return res.status(400).json({ message: 'Anda harus terasosiasi dengan institusi mitra B2B' });
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        inviteCode,
        educatorId,
        institutionId: user.institutionId,
      },
    });

    return res.status(201).json({
      message: 'Kelas berhasil dibuat',
      class: newClass,
    });
  } catch (error) {
    console.error('Error creating class:', error);
    return res.status(500).json({ message: 'Gagal membuat kelas baru' });
  }
};
