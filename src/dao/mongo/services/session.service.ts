import { compare } from 'bcryptjs'
import { type Response } from 'express'
import { type IUser, type IUserToken } from '../../../types/IUser'
import { CustomError } from '../../../utils/CustomError'
import { generateToken, type ReturnToken } from '../../../utils/generateToken'
import { hashPassword } from '../../../utils/hashPassword'
import { User } from '../models/User'

interface PropsResetPass {
  uid: string
  newPassword: string
}
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

    // actualizando la ultima connection
    await User.updateOne(
      { _id: userData._id },
      { lastConnection: new Date().toUTCString() }
    )

    // Generar un token JWT para el usuario
    const token = await generateToken(userData)
    return token
  }

  async current({ uid }: IUserToken): Promise<IUser> {
    const user = await User.findById(uid).populate({
      path: 'cart',
      populate: {
        path: 'products.product',
        model: 'Product'
      }
    })
    if (user === null) {
      throw new CustomError('Usuario no encontrado', 403)
    }
    return user
  }

  async logout(res: Response, uid: string): Promise<string> {
    res.clearCookie('token')

    // actualizando la ultima connection
    await User.updateOne(
      { _id: uid },
      { lastConnection: new Date().toUTCString() }
    )
    return 'sesión cerrada'
  }

  async resetPassword({ uid, newPassword }: PropsResetPass): Promise<string> {
    const user = await User.findById(uid)
    if (user === null) {
      throw new CustomError('Usuario no encontrado', 403)
    }

    if (newPassword === undefined) {
      throw new CustomError('Proporcione la nueva contraseña', 400)
    }

    // Verificar si la nueva contraseña es igual a la contraseña actual
    const isSamePassword = await compare(newPassword, user.password)
    if (isSamePassword) {
      throw new CustomError('La contraseña debe ser diferente a la actual', 400)
    }

    // Generar un hash de la nueva contraseña
    const hashedPassword = await hashPassword(newPassword)

    user.password = hashedPassword
    await user.save()
    return 'Contraseña restablecida exitosamente'
  }
}

export default SessionService
