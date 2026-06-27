import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Increased limit for local testing convenience
  message: { message: 'Terlalu banyak percobaan masuk. Silakan coba lagi dalam 1 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Increased limit for local testing convenience
  message: { message: 'Terlalu banyak percobaan registrasi. Silakan coba lagi dalam 1 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // Increased limit for local testing convenience
  message: { message: 'Terlalu banyak permintaan API. Silakan coba lagi nanti.' },
  standardHeaders: true,
  legacyHeaders: false,
});
