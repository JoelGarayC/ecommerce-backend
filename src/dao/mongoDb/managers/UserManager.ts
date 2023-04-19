import { type IUser, type ReturnToken } from '../../../types/IUser'
import { CustomError } from '../../../utils/CustomError'
import { generateToken } from '../../../utils/generateToken'
import { hashPassword } from '../../../utils/hashPassword'
import { validateFieldsUser } from '../../../utils/validations'
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
      role: user.role?.length > 0 ? user.role : 'user'
    })
    const userSave = await newUser.save()

    // Generar un token JWT para el nuevo usuario
    const token = await generateToken(userSave)

    return { message: 'Usuario creado exitosamente', token }
  }
}

export default UserManager
