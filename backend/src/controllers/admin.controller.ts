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
