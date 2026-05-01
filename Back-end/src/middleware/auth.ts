import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';
import { publicUser } from '../data/store.js';
import { repo } from '../data/repository.js';
import { UserRole } from '../types.js';

type JwtPayload = {
  sub: string;
};

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : null;

  if (!token) {
    res.status(401).json({ message: 'Authentication token is required.' });
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
    const user = await repo.findUserById(payload.sub);

    if (!user) {
      res.status(401).json({ message: 'User no longer exists.' });
      return;
    }

    req.user = publicUser(user);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export const requireRoles =
  (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'You do not have permission to access this resource.' });
      return;
    }

    next();
  };
