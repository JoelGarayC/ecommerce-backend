import { compare } from 'bcryptjs'
import { type Response } from 'express'
import { type IUser, type IUserToken } from '../../../types/IUser'
import { CustomError } from '../../../utils/CustomError'
import { generateToken, type ReturnToken } from '../../../utils/generateToken'
import { hashPassword } from '../../../utils/hashPassword'
import { User } from '../models/User'

class SessionService {
  async register(user: IUser): Promise<ReturnToken> {
    const existingUser = await User.findOne({ email: user.email })
    if (existingUser !== null) {
      throw new CustomError(
        'EL correo electrónico ya está registrado. Inicia sesión!',
        400
      )
    }

    const newUser = new User({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      password: await hashPassword(user.password),
      role: user.role !== undefined ? user.role : 'user'
    })
    const userSave = await newUser.save()

    // Generar un token JWT para el nuevo usuario
    const token = await generateToken(userSave)
    return token
  }

  async login(user: IUser): Promise<ReturnToken> {
    const userData = await User.findOne({ email: user.email })
    if (userData === null) {
      throw new CustomError('El correo electrónico no existe. Regístrate!', 403)
    }

    const match = await compare(user.password, userData.password)
    if (!match) {
      throw new CustomError('Contraseña incorrecta', 403)
    }

    // Generar un token JWT para el usuario
    const token = await generateToken(userData)
    return token
  }

  async current({ uid }: IUserToken): Promise<IUser> {
    const user = await User.findById(uid).populate('cart')
    if (user === null) {
      throw new CustomError('Usuario no encontrado', 403)
    }
    return user
  }

  async logout(res: Response): Promise<string> {
    res.clearCookie('token')
    return 'sesión cerrada'
  }
}

export default SessionService
