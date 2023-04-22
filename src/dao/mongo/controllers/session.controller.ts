import { type Request, type Response } from 'express'
import { responseCustomError } from '../../../utils/CustomError'
import SessionService from '../services/session.service'

const user = new SessionService()

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

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body
  try {
    const data = await user.login({ email, password })
    res
      .cookie('token', data.token, {
        httpOnly: true,
        maxAge: data.expiresIn
      })
      .status(201)
      .json({
        status: 'success',
        message: 'sesión iniciada'
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

export async function logout(req: any, res: Response): Promise<void> {
  try {
    const data = await user.logout(res)
    res.status(201).json({
      status: 'success',
      user: data
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}
