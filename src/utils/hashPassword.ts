import { genSalt, hash } from 'bcryptjs'
import { logger } from './logger'

export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await genSalt(10)
    const hashedPassword = await hash(password, salt)
    return hashedPassword
  } catch (err: any) {
    logger.error(`Ocurrió un error en hasPassword: ${err?.message as string} `)
    throw new Error(err.message)
  }
}
