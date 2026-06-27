import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'tactilabs_secret_key_2026_secure_access_token_123';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'tactilabs_refresh_key_2026_secure_refresh_token_456';

const generateTokens = async (userId: string) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  // Save refresh token to db
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
  const { email, password, name, institutionId } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password minimal harus 8 karakter' });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'STUDENT',
        institutionId: institutionId || null,
        xp: 0,
        level: 1,
      },
    });

    const { accessToken, refreshToken } = await generateTokens(user.id);

    // Secure HttpOnly Cookie for Refresh Token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      message: 'Registrasi berhasil',
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        xp: user.xp,
        level: user.level,
      },
    });
  } catch (error) {
    console.error('Error in register:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: 'Kredensial yang Anda masukkan salah.' });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({ message: 'Akun Anda telah dinonaktifkan' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Kredensial yang Anda masukkan salah.' });
    }

    const { accessToken, refreshToken } = await generateTokens(user.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'Login berhasil',
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        xp: user.xp,
        level: user.level,
      },
    });
  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token tidak ditemukan' });
  }

  try {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken || storedToken.isRevoked || new Date() > storedToken.expiresAt) {
      return res.status(401).json({ message: 'Refresh token tidak valid atau kedaluwarsa' });
    }

    // Revoke current token (Refresh Token Rotation)
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    const user = await prisma.user.findUnique({
      where: { id: storedToken.userId },
    });

    if (!user || user.status === 'SUSPENDED') {
      return res.status(401).json({ message: 'Pengguna tidak valid' });
    }

    const tokens = await generateTokens(user.id);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    console.error('Error in refresh token:', error);
    return res.status(401).json({ message: 'Gagal memproses refresh token' });
  }
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (refreshToken) {
    try {
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { isRevoked: true },
      });
    } catch (err) {
      // Ignore database write failures during logout
    }
  }

  res.clearCookie('refreshToken');
  return res.status(200).json({ message: 'Logout berhasil' });
};
