import { createQuest, updateQuest, deleteQuest } from '../controllers/admin.controller';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
  const mPrisma = {
    quest: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }
  };
  return {
    PrismaClient: jest.fn().mockImplementation(() => mPrisma)
  };
});

describe('Admin Controller - Quest CRUD Operations', () => {
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
    };
    jest.clearAllMocks();
  });

  describe('createQuest', () => {
    it('should create a new quest successfully with valid data', async () => {
      req = {
        body: {
          title: 'Hukum Ohm Baru',
          description: 'Selesaikan sirkuit Hukum Ohm',
          topic: 'OHM_LAW',
          difficulty: 'BEGINNER',
          xpReward: '120',
          orderIndex: '4',
          circuitConfig: '{"components":["BATTERY"]}',
          instructions: '["Langkah 1"]'
        }
      };

      (prisma.quest.create as jest.Mock).mockResolvedValue({
        id: 'quest-uuid-999',
        title: 'Hukum Ohm Baru',
        xpReward: 120
      });

      await createQuest(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Quest berhasil dibuat'
      }));
    });

    it('should fail if required fields are missing', async () => {
      req = {
        body: {
          title: 'Missing fields'
        }
      };

      await createQuest(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Harap lengkapi semua field wajib'
      });
    });
  });

  describe('updateQuest', () => {
    it('should update quest successfully', async () => {
      req = {
        params: { id: 'quest-uuid-999' },
        body: {
          title: 'Hukum Ohm Terupdate',
          xpReward: '150'
        }
      };

      (prisma.quest.update as jest.Mock).mockResolvedValue({
        id: 'quest-uuid-999',
        title: 'Hukum Ohm Terupdate'
      });

      await updateQuest(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Quest berhasil diperbarui'
      }));
    });
  });

  describe('deleteQuest', () => {
    it('should delete quest successfully', async () => {
      req = {
        params: { id: 'quest-uuid-999' }
      };

      (prisma.quest.delete as jest.Mock).mockResolvedValue({});

      await deleteQuest(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Quest berhasil dihapus'
      });
    });
  });
});
