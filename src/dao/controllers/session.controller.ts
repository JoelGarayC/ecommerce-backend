import { type Request, type Response } from 'express'
import { verify } from 'jsonwebtoken'
import {
  JWT_SECRET,
  NODEMAILER_USER,
  NODE_ENV,
  api,
  transporter
} from '../../config'
import { CustomError, responseCustomError } from '../../utils/CustomError'
import { generateTokenRecoveryPass } from '../../utils/generateToken'
import { logger } from '../../utils/logger'
import UserDTO from '../DTOs/User.dto'
import SessionService from '../mongo/services/session.service'
import UserService from '../mongo/services/user.service'

const session = new SessionService()
const user = new UserService()

export async function register(req: Request, res: Response): Promise<void> {
  const { firstName, lastName, email, password, role, age } = req.body

  try {
    const data = await session.register({
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
    const data = await session.login({ email, password })

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
    const data = await session.current({ uid, role })
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
    const data = await session.logout(res)
    res.status(201).json({
      status: 'success',
      message: data
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function recoveryPassword(
  req: Request,
  res: Response
): Promise<void> {
  const { email } = req.body

  try {
    if (email === undefined) {
      throw new CustomError('Escriba el email de envio en el body', 400)
    }
    // Obtener el correo electrónico del usuario desde la solicitud
    const use = await user.getUserByEmail(email)
    // genera token valido de 1 hora
    const token = await generateTokenRecoveryPass(use)

    // Crear un enlace con el token de restablecimiento de contraseña
    const resetLink = `${api.urlBase}/resetPassword?token=${token}`

    // Configurar el contenido del correo electrónico
    const mailOptions = {
      from: NODEMAILER_USER as string,
      to: email,
      subject: 'Restablecimiento de contraseña',
      html: `<p>Para restablecer tu contraseña, haz clic en el siguiente enlace: <a href="${resetLink}">${resetLink}</a></p>`
    }

    const info = await transporter.sendMail(mailOptions)

    logger.info(
      `Email enviado a ${email as string}, messageId: ${info.messageId}`
    )

    res.status(201).json({
      status: 'success',
      message: `Mensaje enviado a ${email as string}`
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function resetPassword(
  req: Request,
  res: Response
): Promise<void> {
  const token = req.query?.token as string
  const { newPassword } = req.body

  try {
    if (token === undefined) {
      throw new CustomError('JWT token must be provided', 400)
    }
    // Verificar el token
    const payload: any = verify(token, JWT_SECRET as string)

    // Extraer el ID de usuario del token decodificado
    const uid = payload.uid as string

    const data = await session.resetPassword({ uid, newPassword })
    res.status(201).json({
      status: 'success',
      message: data
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}
