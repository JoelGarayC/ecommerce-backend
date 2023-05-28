import { type IProduct, type IThumbnail } from '../../types/IProduct'

class ProductDTO implements IProduct {
  title: string
  description: string
  code: string
  stock: number
  price: number
  category: string
  status: boolean
  thumbnails?: IThumbnail[] | undefined
  owner?: string | undefined

  constructor(product: any) {
    this.title = product.title
    this.description = product.description
    this.price = product.price
    this.code = product.code
    this.stock = product.stock
    this.category = product.category
    this.status = product.status
    this.thumbnails = product.thumbnails
    this.owner = product.owner
  }
}

export default ProductDTO
