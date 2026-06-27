import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type Role = 'STUDENT' | 'EDUCATOR' | 'ADMIN';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: Role;
    institutionId: string | null;
  };
}

export const authenticateJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token otentikasi tidak disediakan' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tactilabs_secret_key_2026_secure_access_token_123') as {
      userId: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        institutionId: true,
        status: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Pengguna tidak ditemukan' });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({ message: 'Akun Anda ditangguhkan' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as Role,
      institutionId: user.institutionId,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid atau kedaluwarsa' });
  }
};

export const requireRole = (roles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Tidak terautentikasi' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Akses ditolak. Anda tidak memiliki izin.' });
    }

    next();
  };
};
