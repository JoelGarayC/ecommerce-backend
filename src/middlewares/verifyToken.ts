import { type NextFunction, type Response } from 'express'
import { verify } from 'jsonwebtoken'
import { JWT_SECRET } from '../config'

function verifyToken(req: any, res: Response, next: NextFunction): void {
  try {
    let token = req.headers.authorization
    if (token === undefined) {
      throw new Error('No se ha proporcionado un token')
    }
    token = token?.replace('Bearer ', '')
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

export default verifyToken

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
    case 'No Bearer':
      return 'Utilice el prefijo Bearer'
    default:
      return message
  }
}
