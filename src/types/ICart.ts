import { type Types } from 'mongoose'

export interface ICartItem {
  product: string
  quantity: number
}

export interface ICart extends Document {
  _id?: Types.ObjectId
  products: ICartItem[]
}
