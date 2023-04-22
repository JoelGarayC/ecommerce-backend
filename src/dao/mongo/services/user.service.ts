import { type IUser } from '../../../types/IUser'
import { CustomError } from '../../../utils/CustomError'
import { User } from '../models/User'

class UserService {
  async getUsers(): Promise<IUser[]> {
    const users = await User.find().lean()
    if (users.length === 0) {
      throw new CustomError('No existen usuarios', 401)
    }
    return users
  }

  async getUserByID(id: string): Promise<IUser> {
    const user = await User.findById(id)
    if (user === null) {
      throw new CustomError('No se encontró al usuario', 401)
    }
    return user
  }
}

export default UserService
