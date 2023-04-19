import { genSalt, hash } from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await genSalt(10)
    const hashedPassword = await hash(password, salt)
    return hashedPassword
  } catch (err: any) {
    throw new Error(err.message)
  }
}
