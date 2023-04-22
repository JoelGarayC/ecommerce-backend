import { compare } from 'bcryptjs'
import {
  type IUser,
  type IUserCurrent,
  type IUserToken
} from '../../../types/IUser'
import { CustomError } from '../../../utils/CustomError'
import { generateToken, type ReturnToken } from '../../../utils/generateToken'
import { hashPassword } from '../../../utils/hashPassword'
import {
  validateFieldsUser,
  validateFieldsUserLogin
} from '../../../utils/validations'
import { User } from '../models/User'

class UserManager {
  async register(user: IUser): Promise<ReturnToken> {
    validateFieldsUser(user)

    const existingUser = await User.findOne({ email: user.email })
    if (existingUser !== null) {
      throw new CustomError('Correo electrónico ya registrado', 400)
    }

    const newUser = new User({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: await hashPassword(user.password),
      role: user.role !== null ? user.role : 'user'
    })
    const userSave = await newUser.save()

    // Generar un token JWT para el nuevo usuario
    const token = await generateToken(userSave)

    return token
  }

  async login(user: IUser): Promise<ReturnToken> {
    validateFieldsUserLogin(user)

    const userData = await User.findOne({ email: user.email })
    if (userData === null) {
      throw new CustomError('Correo electrónico no existe!', 403)
    }

    const match = await compare(user.password, userData.password)
    if (!match) {
      throw new CustomError('Contraseña incorrecta', 403)
    }

    // Generar un token JWT para el usuario
    const token = await generateToken(userData)

    return token
  }

  async current({ uid, role }: IUserToken): Promise<IUserCurrent> {
    const user = await User.findById(uid)
    if (user === null) {
      throw new CustomError('Usuario no encontrado', 403)
    }
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role
    }
  }
}

export default UserManager
