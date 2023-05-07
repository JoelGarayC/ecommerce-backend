import { type Request, type Response } from 'express'
import { responseCustomError } from '../../utils/CustomError'
import UserService from '../mongo/services/user.service'

const user = new UserService()

export async function getUsers(_req: Request, res: Response): Promise<void> {
  try {
    const data = await user.getUsers()
    res.status(201).json({
      status: 'success',
      payload: data
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
