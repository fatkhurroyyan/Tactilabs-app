import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAdminOverview = async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalInstitutions = await prisma.institution.count();
    const totalQuests = await prisma.quest.count();
    const totalCompletedProgress = await prisma.questProgress.count({
      where: { status: 'COMPLETED' },
    });

    const completionRate = totalUsers > 0 ? (totalCompletedProgress / totalUsers) : 0;

    return res.status(200).json({
      summary: {
        totalUsers,
        totalInstitutions,
        totalQuests,
        completionRate: Math.round(completionRate * 100),
      },
    });
  } catch (error) {
    console.error('Error in getAdminOverview:', error);
    return res.status(500).json({ message: 'Gagal mengambil overview admin' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        institution: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ users });
  } catch (error) {
    console.error('Error getting users:', error);
    return res.status(500).json({ message: 'Gagal mengambil daftar pengguna' });
  }
};

export const updateUserStatusOrRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, status } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        role: role || undefined,
        status: status || undefined,
      },
    });

    return res.status(200).json({
      message: 'Status/Role pengguna berhasil diperbarui',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    return res.status(500).json({ message: 'Gagal memperbarui pengguna' });
  }
};

export const getInstitutions = async (req: Request, res: Response) => {
  try {
    const institutions = await prisma.institution.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ institutions });
  } catch (error) {
    console.error('Error getting institutions:', error);
    return res.status(500).json({ message: 'Gagal mengambil institusi' });
  }
};

export const createInstitution = async (req: Request, res: Response) => {
  const { name, type, licenseType, licenseExpiresAt, maxStudents } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: 'Nama dan Tipe wajib diisi' });
  }

  try {
    const institution = await prisma.institution.create({
      data: {
        name,
        type,
        licenseType: licenseType || 'FREE',
        licenseExpiresAt: licenseExpiresAt ? new Date(licenseExpiresAt) : null,
        maxStudents: maxStudents || 50,
      },
    });

    return res.status(201).json({
      message: 'Institusi berhasil dibuat',
      institution,
    });
  } catch (error) {
    console.error('Error creating institution:', error);
    return res.status(500).json({ message: 'Gagal membuat institusi baru' });
  }
};

export const createQuest = async (req: Request, res: Response) => {
  const { title, description, topic, difficulty, xpReward, prerequisiteQuestId, circuitConfig, instructions, hint, isPremium, orderIndex } = req.body;
  if (!title || !description || !topic || !difficulty || xpReward === undefined || !circuitConfig || !instructions || orderIndex === undefined) {
    return res.status(400).json({ message: 'Harap lengkapi semua field wajib' });
  }
  try {
    const quest = await prisma.quest.create({
      data: {
        title,
        description,
        topic,
        difficulty,
        xpReward: parseInt(xpReward),
        prerequisiteQuestId: prerequisiteQuestId || null,
        circuitConfig: typeof circuitConfig === 'string' ? circuitConfig : JSON.stringify(circuitConfig),
        instructions: typeof instructions === 'string' ? instructions : JSON.stringify(instructions),
        hint: hint || null,
        isPremium: isPremium || false,
        orderIndex: parseInt(orderIndex),
      }
    });
    return res.status(201).json({ message: 'Quest berhasil dibuat', quest });
  } catch (error) {
    console.error('Error creating quest:', error);
    return res.status(500).json({ message: 'Gagal membuat quest baru' });
  }
};

export const updateQuest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, topic, difficulty, xpReward, prerequisiteQuestId, circuitConfig, instructions, hint, isPremium, orderIndex } = req.body;
  try {
    const quest = await prisma.quest.update({
      where: { id },
      data: {
        title,
        description,
        topic,
        difficulty,
        xpReward: xpReward !== undefined ? parseInt(xpReward) : undefined,
        prerequisiteQuestId: prerequisiteQuestId !== undefined ? (prerequisiteQuestId || null) : undefined,
        circuitConfig: circuitConfig !== undefined ? (typeof circuitConfig === 'string' ? circuitConfig : JSON.stringify(circuitConfig)) : undefined,
        instructions: instructions !== undefined ? (typeof instructions === 'string' ? instructions : JSON.stringify(instructions)) : undefined,
        hint: hint !== undefined ? (hint || null) : undefined,
        isPremium: isPremium !== undefined ? isPremium : undefined,
        orderIndex: orderIndex !== undefined ? parseInt(orderIndex) : undefined,
      }
    });
    return res.status(200).json({ message: 'Quest berhasil diperbarui', quest });
  } catch (error) {
    console.error('Error updating quest:', error);
    return res.status(500).json({ message: 'Gagal memperbarui quest' });
  }
};

export const deleteQuest = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.quest.delete({
      where: { id }
    });
    return res.status(200).json({ message: 'Quest berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting quest:', error);
    return res.status(500).json({ message: 'Gagal menghapus quest' });
  }
};

export const getBadges = async (req: Request, res: Response) => {
  try {
    const badges = await prisma.badge.findMany();
    const mapped = badges.map(b => ({
      id: b.id,
      name: b.name,
      description: b.description,
      icon: b.iconUrl,
      criteria: b.criteriaValue
    }));
    return res.status(200).json({ badges: mapped });
  } catch (error) {
    console.error('Error fetching badges:', error);
    return res.status(500).json({ message: 'Gagal mengambil data badge' });
  }
};

export const createBadge = async (req: Request, res: Response) => {
  const { name, description, icon, criteria } = req.body;
  if (!name || !description || !icon || !criteria) {
    return res.status(400).json({ message: 'Harap lengkapi semua field wajib' });
  }
  try {
    const parsedCriteria = typeof criteria === 'string' ? JSON.parse(criteria) : criteria;
    const badge = await prisma.badge.create({
      data: {
        name,
        description,
        iconUrl: icon,
        criteriaType: parsedCriteria.type || 'SPECIAL',
        criteriaValue: typeof criteria === 'string' ? criteria : JSON.stringify(criteria)
      }
    });
    return res.status(201).json({ message: 'Badge berhasil dibuat', badge });
  } catch (error) {
    console.error('Error creating badge:', error);
    return res.status(500).json({ message: 'Gagal membuat badge baru' });
  }
};

export const updateBadge = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, icon, criteria } = req.body;
  try {
    let criteriaType: string | undefined = undefined;
    let criteriaValue: string | undefined = undefined;
    if (criteria) {
      const parsedCriteria = typeof criteria === 'string' ? JSON.parse(criteria) : criteria;
      criteriaType = parsedCriteria.type || 'SPECIAL';
      criteriaValue = typeof criteria === 'string' ? criteria : JSON.stringify(criteria);
    }
    const badge = await prisma.badge.update({
      where: { id },
      data: {
        name,
        description,
        iconUrl: icon,
        criteriaType,
        criteriaValue
      }
    });
    return res.status(200).json({ message: 'Badge berhasil diperbarui', badge });
  } catch (error) {
    console.error('Error updating badge:', error);
    return res.status(500).json({ message: 'Gagal memperbarui badge' });
  }
};

export const deleteBadge = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.badge.delete({
      where: { id }
    });
    return res.status(200).json({ message: 'Badge berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting badge:', error);
    return res.status(500).json({ message: 'Gagal menghapus badge' });
  }
};


