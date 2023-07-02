import { type IUser, type UserRole } from '../../../types/IUser'
import { CustomError } from '../../../utils/CustomError'
import { Cart } from '../models/Cart'
import { User } from '../models/User'

class UserService {
  async getUsers(): Promise<IUser[]> {
    const users = await User.find().populate('cart').lean()
    if (users.length === 0) {
      throw new CustomError('No existen usuarios', 401)
    }
    return users
  }

  async getUserById(uid: string): Promise<IUser> {
    const user = await User.findById(uid).lean()
    if (user === null) {
      throw new CustomError('No se encontró al usuario', 401)
    }
    return user
  }

  async getUserByEmail(email: string): Promise<IUser> {
    const user = await User.findOne({ email })
    if (user === null) {
      throw new CustomError('No se encontró al usuario', 401)
    }
    return user
  }

  async getUserRole(uid: string): Promise<UserRole> {
    const user = await User.findById(uid)
    if (user === null) {
      throw new CustomError('No se encontró al usuario', 401)
    }
    return user?.role as UserRole
  }

  async updateUserRole(uid: string, newRole: string): Promise<string> {
    const user = await User.findById(uid)
    if (user === null) {
      throw new CustomError('No se encontró al usuario', 401)
    }
    await user.updateOne({ role: newRole })

    return 'Rol de usuario actualizado'
  }

  async deleteUserById(uid: string): Promise<string> {
    const userById = await User.findById(uid)
    if (userById === null) {
      throw new CustomError('No se encontró al usuario', 400)
    }
    const deleteCart = await Cart.findByIdAndDelete(userById.cart)
    if (deleteCart === null) {
      throw new CustomError('No se pudo eliminar el carrito del usuario', 400)
    }
    const userDelete = await User.findByIdAndDelete(uid)
    if (userDelete === null) {
      throw new CustomError('No se encontró al usuario', 400)
    }
    return 'Usuario eliminado'
  }
}

export default UserService
