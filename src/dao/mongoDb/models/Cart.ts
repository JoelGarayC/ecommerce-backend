import mongoose, { Schema } from 'mongoose'
import { type ICart } from '../../../types/ICart'

const CartSchema: Schema = new Schema<ICart>({
  products: [
    {
      product: {
        ref: 'Product',
        type: Schema.Types.ObjectId
      },
      quantity: Number
    }
  ]
})

export const Cart = mongoose.model<ICart>('Cart', CartSchema)
