import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Otorisasi gagal' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        institution: {
          select: {
            name: true,
          },
        },
        badges: {
          include: {
            badge: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Get quest stats
    const questStats = await prisma.questProgress.groupBy({
      by: ['status'],
      where: { studentId: userId },
      _count: {
        status: true,
      },
    });

    const completedQuests = questStats.find(s => s.status === 'COMPLETED')?._count.status || 0;
    const totalAttempts = await prisma.questProgress.aggregate({
      where: { studentId: userId },
      _sum: {
        attempts: true,
      },
    });

    const allBadges = await prisma.badge.findMany();
    const userBadgeIds = new Set(user.badges.map(b => b.badgeId));

    const badgeShowcase = allBadges.map(badge => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      iconUrl: badge.iconUrl,
      isEarned: userBadgeIds.has(badge.id),
      earnedAt: user.badges.find(b => b.badgeId === badge.id)?.earnedAt || null,
    }));

    return res.status(200).json({
      profile: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role,
        xp: user.xp,
        level: user.level,
        institutionName: user.institution?.name || 'Independen',
        createdAt: user.createdAt,
      },
      stats: {
        completedQuests,
        totalAttempts: totalAttempts._sum.attempts || 0,
      },
      badges: badgeShowcase,
    });
  } catch (error) {
    console.error('Error in getProfile:', error);
    return res.status(500).json({ message: 'Gagal mengambil data profil' });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const { name, avatarUrl } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'Otorisasi gagal' });
  }

  if (!name) {
    return res.status(400).json({ message: 'Nama tidak boleh kosong' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        avatarUrl: avatarUrl || undefined,
      },
    });

    return res.status(200).json({
      message: 'Profil berhasil diperbarui',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        avatarUrl: updatedUser.avatarUrl,
        xp: updatedUser.xp,
        level: updatedUser.level,
      },
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return res.status(500).json({ message: 'Gagal memperbarui profil' });
  }
};
