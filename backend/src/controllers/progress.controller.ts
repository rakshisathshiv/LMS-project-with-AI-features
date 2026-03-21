import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const updateProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { videoId, watchedSeconds, completed } = req.body;

    const progress = await prisma.videoProgress.upsert({
      where: {
        userId_videoId: { userId, videoId }
      },
      update: {
        watchedSeconds,
        completed: completed !== undefined ? completed : undefined
      },
      create: {
        userId,
        videoId,
        watchedSeconds,
        completed: completed || false
      }
    });

    res.json(progress);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const progressList = await prisma.videoProgress.findMany({
      where: { userId },
      include: {
        video: {
          select: {
            id: true,
            title: true,
            sectionId: true,
            durationSeconds: true
          }
        }
      }
    });
    res.json(progressList);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
