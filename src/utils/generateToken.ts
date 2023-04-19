import { sign } from 'jsonwebtoken'
import { JWT_REFRESH, JWT_SECRET } from '../config'
import { type IUser } from '../types/IUser'
import { CustomError } from './CustomError'

export interface ReturnToken {
  token?: string
  refreshToken?: string
  expiresIn: number
}

export async function generateToken(user: IUser): Promise<ReturnToken> {
  try {
    const expiresIn: number = 60 * 15 // 15 minutos de expiracion
    const token = sign(
      { uid: user._id, role: user.role },
      JWT_SECRET as string,
      {
        expiresIn
      }
    )
    return { token, expiresIn }
  } catch (err) {
    throw new CustomError('El token no se pudo generar', 400)
  }
}

export async function generateRefreshToken(user: IUser): Promise<ReturnToken> {
  try {
    const expiresIn: number = 60 * 60 * 24 * 30 // 30 dias de expiracion
    const refreshToken = sign(
      { uid: user._id, role: user.role },
      JWT_REFRESH as string,
      {
        expiresIn
      }
    )
    return { refreshToken, expiresIn }
  } catch (err) {
    throw new CustomError('El refreshToken no se pudo generar', 400)
  }
}
