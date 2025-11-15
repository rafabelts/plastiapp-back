import bcrypt from 'bcrypt';
import { env } from './envConfig';

export async function hash(password: string) {
  try {
    const salt = await bcrypt.genSalt(env.SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  } catch (e) {
    throw new Error(`Error hashing password: ${(e as Error).message}`)
  }
}
