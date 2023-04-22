import { type Request, type Response } from 'express'
import { responseCustomError } from '../../../utils/CustomError'
import UserService from '../services/user.service'

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
