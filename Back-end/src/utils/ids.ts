import crypto from 'node:crypto';

export const createId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;
