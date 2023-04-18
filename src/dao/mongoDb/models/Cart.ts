import { Schema, model } from 'mongoose'
import { type ICart } from '../../../types/ICart'

const CartSchema = new Schema<ICart>({
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

export const Cart = model<ICart>('Cart', CartSchema)
