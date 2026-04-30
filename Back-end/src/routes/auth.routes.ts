import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { Router } from 'express';
import { z } from 'zod';
import { env } from '../config/env.js';
import { publicUser } from '../data/store.js';
import { repo } from '../data/repository.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  role: z.enum(['student', 'teacher', 'admin', 'super-admin']).optional(),
});

router.post('/login', validateBody(loginSchema), async (req, res) => {
  const { email, password, role } = req.body as z.infer<typeof loginSchema>;
  const user = await repo.findUserByEmail(email);

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    res.status(401).json({ message: 'Invalid email or password.' });
    return;
  }

  if (role && user.role !== role) {
    res.status(403).json({ message: `This account is not registered as ${role}.` });
    return;
  }

  const signOptions: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
  };
  const token = jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, signOptions);

  res.json({
    token,
    user: publicUser(user),
  });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
