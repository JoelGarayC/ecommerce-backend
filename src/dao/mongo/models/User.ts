import { Schema, model } from 'mongoose'
import { type IUser } from '../../../types/IUser'

const UserSchema = new Schema<IUser>({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
    trim: true,
    index: true
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: 'Cart',
    unique: true,
    sparse: true
  },
  age: Number,
  password: String,
  role: {
    type: String,
    default: 'user'
  },
  documents: {
    type: [
      {
        name: String,
        reference: String
      }
    ],
    default: []
  },
  lastConnection: {
    type: String
  }
})

export const User = model<IUser>('User', UserSchema)
