import { type Request, type Response } from 'express'
import { NODE_ENV } from '../../../config'
import { responseCustomError } from '../../../utils/CustomError'
import SessionService from '../services/session.service'

const user = new SessionService()

export async function register(req: Request, res: Response): Promise<void> {
  const { firstName, lastName, email, password, role, age } = req.body

  try {
    const data = await user.register({
      firstName,
      lastName,
      email,
      password,
      age,
      role
    })

    const cookieOptions: any = {
      httpOnly: true,
      maxAge: data.expiresIn
    }

    if (NODE_ENV === 'production') {
      cookieOptions.secure = true
      cookieOptions.sameSite = false
    }

    res.cookie('token', data.token, cookieOptions)
    res.cookie('token', data.token, {
      ...cookieOptions,
      domain: 'ecommerce-backend-rho.vercel.app'
    })

    res.status(201).json({
      status: 'success',
      message: 'usuario registrado'
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body

  try {
    const data = await user.login({ email, password })

    const cookieOptions: any = {
      httpOnly: true,
      maxAge: data.expiresIn
    }

    if (NODE_ENV === 'production') {
      cookieOptions.secure = true
      cookieOptions.sameSite = false
    }

    res.cookie('token', data.token, cookieOptions)
    res.cookie('token', data.token, {
      ...cookieOptions,
      domain: 'ecommerce-backend-rho.vercel.app'
    })

    res.status(201).json({
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

export async function logout(_req: Request, res: Response): Promise<void> {
  try {
    // const data = await user.logout(res)
    // res.status(201).json({
    //   status: 'success',
    //   message: data
    // })
    await user.logout(res)

    res.status(201).redirect('/login')
  } catch (err) {
    responseCustomError(res, err)
  }
}
