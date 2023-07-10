import { type IUser, type UserRole } from '../../types/IUser'

class UserDTO {
  firstName: string
  lastName: string
  email: string
  age: number | undefined
  role: UserRole | undefined
  cart: string | undefined
  lastConnection: string | undefined

  constructor(user: IUser) {
    this.firstName = user.firstName ?? 'Nombres'
    this.lastName = user.lastName ?? 'Apellidos'
    this.email = user.email
    this.age = user.age
    this.role = user.role
    this.cart = user.cart
    this.lastConnection = user.lastConnection
  }
}

export default UserDTO
