export type Sort = 'desc' | 'asc'

export interface IThumbnail {
  name: string
  path: string
}

export interface IProduct {
  title: string
  description: string
  price: number
  thumbnails?: IThumbnail[]
  code: string
  stock: number
  category: string
  status: boolean
}

export interface ProductProps {
  page: string
  limit: string
  sort: string
  query: string
  filter?: string
  search?: string
}
