import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Name, email and password are required' });
      return;
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }
    const password_hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password_hash, name } });
    console.log('[register] User created:', user.id, user.email);
    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (err: any) {
    console.error('[register] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: '30d' }
    );
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    console.log('[login] User logged in:', user.id, user.email);
    res.json({ accessToken, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err: any) {
    console.error('[login] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.cookies || {};
    if (!refreshToken) {
      res.status(401).json({ error: 'Refresh token required' });
      return;
    }
    const dbToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!dbToken || dbToken.expiryDate < new Date()) {
      res.status(403).json({ error: 'Invalid or expired refresh token' });
      return;
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string, (err: any, decoded: any) => {
      if (err) {
        res.status(403).json({ error: 'Invalid token' });
        return;
      }
      const accessToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_ACCESS_SECRET as string,
        { expiresIn: '15m' }
      );
      res.json({ accessToken });
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const me = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, name: true },
    });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.cookies || {};
    if (refreshToken) {
      await prisma.refreshToken.delete({ where: { token: refreshToken } }).catch(() => {});
    }
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    res.json({ message: 'Logged out successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
