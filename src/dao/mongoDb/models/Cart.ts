import mongoose, { Schema } from 'mongoose'
import { type ICart } from '../../../types/ICart'

const CartSchema: Schema = new Schema<ICart>({
  products: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: Number
    }
  ]
})

export const Cart = mongoose.model<ICart>('Cart', CartSchema)
