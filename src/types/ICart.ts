export interface ICartItem {
  product: string
  quantity: number
}

export interface ICart extends Document {
  products: ICartItem[]
}
