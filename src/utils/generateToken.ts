import { sign } from 'jsonwebtoken'
import { JWT_SECRET } from '../config'
import { type IUser } from '../types/IUser'
import { CustomError } from './CustomError'
import { logger } from './logger'

export interface ReturnToken {
  token: string
  expiresIn: number
  email: string
}

export async function generateToken(user: IUser): Promise<ReturnToken> {
  try {
    const expiresIn: number = 60 * 60 * 24 * 30 // 30 dias de expiracion
    const token = sign(
      { uid: user._id, role: user.role },
      JWT_SECRET as string,
      {
        expiresIn
      }
    )
    return { token, expiresIn, email: user.email }
  } catch (err: any) {
    logger.error(`El token no se pudo generar: ${err?.message as string} `)
    throw new CustomError('El token no se pudo generar', 400)
  }
}
