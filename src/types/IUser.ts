import { type Types } from 'mongoose'

export type UserRole = 'admin' | 'user'

export interface IUser {
  _id?: Types.ObjectId
  firstName: string
  lastName: string
  email: string
  cart?: string
  age?: number
  password: string
  role: UserRole
}

export interface ReturnToken {
  message: string
  token: string
}
