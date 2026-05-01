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
  const objectMessage = error && typeof error === 'object' && 'message' in error
    ? String((error as { message?: string }).message)
    : undefined;
  const objectCode = error && typeof error === 'object' && 'code' in error
    ? String((error as { code?: string }).code)
    : undefined;
  const message = error instanceof Error ? error.message : (objectMessage || 'Unexpected server error.');

  if (env.nodeEnv === 'development') {
    console.error('[errorHandler]', {
      statusCode,
      message,
      code: objectCode,
      error,
    });
  }

  res.status(statusCode).json({
    message,
    ...(env.nodeEnv === 'development' && error instanceof Error ? { stack: error.stack } : {}),
    ...(env.nodeEnv === 'development' && objectCode ? { code: objectCode } : {}),
  });
};
