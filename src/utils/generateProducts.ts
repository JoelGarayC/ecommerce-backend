import { faker } from '@faker-js/faker'
import { type IProduct } from '../types/IProduct'

// Generar 100 productos de ejemplo

export async function generarProducts(): Promise<IProduct[]> {
  const products: IProduct[] = []
  for (let i = 1; i <= 100; i++) {
    const product: IProduct = {
      id: `${i}`,
      title: faker.commerce.productName(),
      price: Number(faker.commerce.price()),
      category: faker.commerce.department(),
      code: `${i}-code`,
      description: faker.commerce.productDescription(),
      status: true,
      stock: Number(faker.string.numeric()),
      thumbnails: [
        {
          name: faker.commerce.productName(),
          path: faker.image.url()
        }
      ]
    }
    products.push(product)
  }
  return products
}
