import { randomBytes } from 'crypto';

export const generateKeyAccess = async (size: number) => {
  return randomBytes(Math.ceil(size / 2))
    .toString('hex')
    .slice(0, size)
    .toUpperCase();
}
