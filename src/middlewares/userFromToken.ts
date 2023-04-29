import { type NextFunction, type Response } from 'express'
import { verify } from 'jsonwebtoken'
import { JWT_SECRET } from '../config'

export const userFromToken = () => {
  return (req: any, res: Response, next: NextFunction): void => {
    try {
      const token = req?.cookies?.token ?? req?.cookies?.tokenApi
      if (token === undefined) {
        throw new Error('No autorizado, ¡Inicia sesión!')
      }
      const payload = verify(token, JWT_SECRET as string)
      req.user = payload // envia el payload al siguiente middleware
      next()
    } catch (err: any) {
      res.status(401).json({
        status: 'error',
        statusCode: 401,
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
    default:
      return message
  }
}
