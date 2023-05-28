import { Schema, model, type Model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { type IProduct } from '../../../types/IProduct'

interface IProductModel extends Model<IProduct> {
  paginate: any
}

const ProductSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnails: {
    type: [
      {
        name: String,
        path: String
      }
    ],
    default: []
  },
  code: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  stock: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  status: { type: Boolean, required: true },
  owner: { type: String, default: 'admin' }
})

ProductSchema.plugin(mongoosePaginate)

export const Product = model<IProduct, IProductModel>('Product', ProductSchema)
