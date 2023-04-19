import { type Request, type Response } from 'express'
import { responseCustomError } from '../../../utils/CustomError'
import UserManager from '../managers/UserManager'

const user = new UserManager()

export async function register(req: Request, res: Response): Promise<void> {
  const { firstName, lastName, email, password, role = 'user' } = req.body
  try {
    const data = await user.register({
      firstName,
      lastName,
      email,
      password,
      role
    })
    res.status(201).json({
      status: 'success',
      token: data.token
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}
