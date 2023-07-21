import { type Request, type Response } from 'express'
import { api } from '../../config'
import { CustomError, responseCustomError } from '../../utils/CustomError'
import { isCompleteDocs } from '../../utils/isCompleteDocs'
import UserDTO from '../DTOs/User.dto'
import { User } from '../mongo/models/User'
import UserService from '../mongo/services/user.service'

const user = new UserService()

export async function getUsers(_req: Request, res: Response): Promise<void> {
  try {
    const data = await user.getUsers()

    //  UserDTO a cada elemento del arreglo
    const dataDTO = data.map((user) => new UserDTO(user))

    res.status(201).json({
      status: 'success',
      payload: dataDTO
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  const { uid } = req.params
  try {
    const data = await user.getUserById(uid)
    res.status(201).json({
      status: 'success',
      user: data
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function deleteUsers(req: any, res: Response): Promise<void> {
  try {
    const data = await user.clearUsers(req.user.uid as string)

    res.status(201).json({
      status: 'success',
      message: data
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function deleteUserById(
  req: Request,
  res: Response
): Promise<void> {
  const { uid } = req.params

  try {
    const data = await user.deleteUserById(uid)
    res.status(201).json({
      status: 'success',
      message: data
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function changeRolePremium(
  req: Request,
  res: Response
): Promise<void> {
  const { uid } = req.params

  try {
    const userRole = await user.getUserRole(uid)

    if (userRole === 'admin') {
      throw new CustomError(
        'No se puede modificar el rol de un usuario Administrator',
        400
      )
    }

    let newRole = ''
    if (userRole === 'user') {
      const res = isCompleteDocs(uid)
      newRole = await res
    } else {
      newRole = 'user'
    }

    const data = await user.updateUserRole(uid, newRole)

    res.status(201).json({
      status: 'success',
      message: data
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function uploadDocuments(
  req: Request,
  res: Response
): Promise<void> {
  const { uid } = req.params
  try {
    // Verificar si no se encontraron archivos en la solicitud
    const docs = req.files
    if (
      !Array.isArray(docs) ||
      docs === null ||
      docs === undefined ||
      docs.length === 0
    ) {
      throw new CustomError('No se encontraron archivos en la solicitud', 400)
    }

    // Guardar la información de las imágenes en la base de datos
    const documents = docs.map((file: Express.Multer.File) => ({
      name: file.filename,
      reference: `${api.urlBase}${file.path.split('public')[1]}`
    }))
    await User.updateOne({ _id: uid }, { $push: { documents } })

    res.status(201).json({
      status: 'success',
      message: 'Archivo cargado correctamente'
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}
