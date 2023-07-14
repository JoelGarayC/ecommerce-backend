import { type NextFunction, type Response } from 'express'
import { verify } from 'jsonwebtoken'
import { JWT_SECRET } from '../config'
import { type UserRole } from '../types/IUser'

export const authorization = (role: UserRole[]) => {
  return (req: any, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization
      const tokenHeader = authHeader?.substring(7)

      // token  desde cookies o headers
      const token = req?.cookies?.token ?? tokenHeader

      if (token === undefined || req.user !== undefined) {
        throw new Error('No autorizado, ¡Inicia sesión!')
      }
      const payload = verify(token, JWT_SECRET as string)
      req.user = payload // envia el payload al siguiente middleware

      if (!role.includes(req.user.role)) {
        throw new Error('No autorizado, es nesesario un rol más específico')
      }
      next()
    } catch (err: any) {
      res.status(403).json({
        status: 'error',
        statusCode: 403,
        message: errorTokens(err.message)
      })
    }
  }
}

function errorTokens(message: string): string {
  switch (message) {
    case 'jwt malformed':
      return 'El token tiene un formato inválido'
    case 'invalid token':
      return 'Token inválido'
    case 'jwt expired':
      return 'Token expirado'
    case 'invalid signature':
      return 'La firma del token no es válida'
    case 'jwt not active':
      return 'Token no activo'
    case 'jwt payload is invalid':
      return 'Payload inválido'
    case 'jwt must be provided':
      return 'El Token debe ser proporcionado'
    default:
      return message
  }
}
