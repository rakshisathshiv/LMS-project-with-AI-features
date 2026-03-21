import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getSubjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const subjects = await prisma.subject.findMany({
      where: { is_published: true },
    });
    res.json(subjects);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getSubjectDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { orderIndex: 'asc' },
          include: {
            videos: {
              orderBy: { orderIndex: 'asc' }
            }
          }
        }
      }
    });

    if (!subject) {
      res.status(404).json({ error: 'Subject not found' });
      return;
    }
    res.json(subject);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const enrollSubject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const subjectId = parseInt(req.params.id as string);

    const enrollment = await prisma.enrollment.create({
      data: { userId, subjectId },
    });
    res.status(201).json(enrollment);
  } catch (err: any) {
    if (err.code === 'P2002') {
      res.status(400).json({ error: 'Already enrolled in this subject' });
      return;
    }
    res.status(500).json({ error: err.message });
  }
};
