import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  const message = error instanceof Error ? error.message : 'Unexpected server error.';

  res.status(statusCode).json({
    message,
    ...(env.nodeEnv === 'development' && error instanceof Error ? { stack: error.stack } : {}),
  });
};
