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
      token: data.token,
      expiresIn: data.expiresIn
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body
  try {
    const data = await user.login({ email, password })
    res.status(201).json({
      status: 'success',
      token: data.token,
      refreshToken: data.refreshToken
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function current(req: any, res: Response): Promise<void> {
  const { uid, role } = req.user
  try {
    const data = await user.current({ uid, role })
    res.status(201).json({
      status: 'success',
      user: data
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}
