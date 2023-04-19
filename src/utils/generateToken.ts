import { sign } from 'jsonwebtoken'
import { JWT_SECRET } from '../config'
import { type IUser } from '../types/IUser'

export async function generateToken(user: IUser): Promise<string> {
  const token = sign(
    { idUser: user._id, role: user.role },
    JWT_SECRET as string
  )
  return token
}
