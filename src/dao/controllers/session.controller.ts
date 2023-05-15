import { type Request, type Response } from 'express'
import { NODE_ENV } from '../../config'
import { responseCustomError } from '../../utils/CustomError'
import UserDTO from '../DTOs/User.dto'
import SessionService from '../mongo/services/session.service'

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
      // no accede desde el front
      httpOnly: true,
      expires: new Date(Date.now() + data.expiresIn * 1000)
    }

    if (NODE_ENV === 'production') {
      cookieOptions.secure = true
      cookieOptions.sameSite = 'None'
    }

    res.cookie('token', data.token, cookieOptions).status(201).json({
      status: 'success',
      message: 'usuario registrado',
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

    const cookieOptions: any = {
      // no accede desde el front
      httpOnly: true,
      expires: new Date(Date.now() + data.expiresIn * 1000)
    }

    if (NODE_ENV === 'production') {
      cookieOptions.secure = true
      cookieOptions.sameSite = 'None'
    }

    res.cookie('token', data.token, cookieOptions).status(201).json({
      status: 'success',
      message: 'sesión iniciada',
      token: data.token,
      expiresIn: data.expiresIn
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function current(req: any, res: Response): Promise<void> {
  const { uid, role } = req.user

  try {
    const data = await user.current({ uid, role })
    // solo información necesaria se le envia al usuario
    const dataDTO = new UserDTO(data)

    res.status(201).json({
      status: 'success',
      user: dataDTO
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  try {
    const data = await user.logout(res)
    res.status(201).json({
      status: 'success',
      message: data
    })
    // await user.logout(res)

    // res.status(201).redirect('/login')
  } catch (err) {
    responseCustomError(res, err)
  }
}
