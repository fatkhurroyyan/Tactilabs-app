import { register } from '../controllers/auth.controller';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
  const mPrisma = {
    user: {
      findUnique: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
    institution: {
      findUnique: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
    }
  };
  return {
    PrismaClient: jest.fn().mockImplementation(() => mPrisma)
  };
});

describe('Auth Controller - B2B License Quota Check', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    res = {
      status: statusMock,
      json: jsonMock,
      cookie: jest.fn().mockReturnThis(),
    } as any;
    jest.clearAllMocks();
  });

  it('should reject registration if the B2B institution student quota is exceeded', async () => {
    req = {
      body: {
        name: 'Test Student',
        email: 'test@example.com',
        password: 'secure_password_123',
        institutionId: 'inst-uuid-123'
      }
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.institution.findUnique as jest.Mock).mockResolvedValue({
      id: 'inst-uuid-123',
      name: 'Telkom University',
      maxStudents: 5
    });
    (prisma.user.count as jest.Mock).mockResolvedValue(5);

    await register(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining('Kuota B2B untuk Telkom University')
    }));
  });

  it('should allow registration if the quota is not reached', async () => {
    req = {
      body: {
        name: 'Test Student',
        email: 'test@example.com',
        password: 'secure_password_123',
        institutionId: 'inst-uuid-123'
      }
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.institution.findUnique as jest.Mock).mockResolvedValue({
      id: 'inst-uuid-123',
      name: 'Telkom University',
      maxStudents: 5
    });
    (prisma.user.count as jest.Mock).mockResolvedValue(3);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: 'user-uuid-123',
      email: 'test@example.com',
      name: 'Test Student',
      role: 'STUDENT',
      institutionId: 'inst-uuid-123'
    });
    (prisma.refreshToken.create as jest.Mock).mockResolvedValue({});

    await register(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(201);
  });
});
