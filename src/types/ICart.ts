export interface ICartItem {
  id: string
  quantity: number
}

export interface ICart extends Document {
  products: ICartItem[]
}
