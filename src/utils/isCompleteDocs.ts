import mongoose from 'mongoose'
import { User } from '../dao/mongo/models/User'
import { CustomError } from './CustomError'
const { ObjectId } = mongoose.Types

export async function isCompleteDocs(uid: string): Promise<string> {
  if (!ObjectId.isValid(uid) || uid === undefined) {
    throw new CustomError('El uid del usuario es incorrecto', 403)
  }
  const userData = await User.findById(uid)

  if (userData === null) {
    throw new CustomError(
      'El usuario aún no ha terminado de procesar su documentación',
      403
    )
  }

  const requiredNames = [
    'idendificación.pdf',
    'comprobante_de_domicilio.pdf',
    'comprobante_de_estado_de_cuenta.pdf'
  ]
  const hasRequiredDocs = requiredNames.every((requiredName) => {
    if (userData.documents === undefined) {
      throw new CustomError(
        'El usuario aún no ha terminado de procesar su documentación',
        403
      )
    }
    return userData.documents.some((doc) => doc.name === requiredName)
  })

  if (!hasRequiredDocs) {
    throw new CustomError(
      'El usuario aún no ha terminado de procesar su documentación',
      403
    )
  }

  return 'premium'
}
