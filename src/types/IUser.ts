import { type Types } from 'mongoose'

export type UserRole = 'admin' | 'user' | 'premium'

export interface IUser {
  _id?: Types.ObjectId | string
  firstName?: string
  lastName?: string
  email: string
  cart?: string
  age?: number
  password: string
  role?: UserRole
}

export interface IUserToken {
  uid: string
  role: UserRole
}

export interface IUserCurrent {
  firstName?: string
  lastName?: string
  email: string
  cart?: string
  age?: number
  role?: UserRole
}
