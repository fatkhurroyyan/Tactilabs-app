import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getLeaderboard = async (req: Request, res: Response) => {
  const { scope, institutionId } = req.query;

  try {
    let whereClause: any = {
      role: 'STUDENT',
      status: 'ACTIVE',
    };

    if (scope === 'institution' && institutionId) {
      whereClause.institutionId = institutionId as string;
    }

    const leaderboard = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        xp: true,
        level: true,
        institution: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { xp: 'desc' },
      take: 100, // Top 100
    });

    // Map properties for client
    const mappedLeaderboard = leaderboard.map((user, idx) => ({
      rank: idx + 1,
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      xp: user.xp,
      level: user.level,
      institutionName: user.institution?.name || 'Independen',
    }));

    return res.status(200).json({ leaderboard: mappedLeaderboard });
  } catch (error) {
    console.error('Error in getLeaderboard:', error);
    return res.status(500).json({ message: 'Gagal mengambil data leaderboard' });
  }
};
