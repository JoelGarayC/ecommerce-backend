import fs from 'fs'
import path from 'path'
import { type IProduct, type ProductProps } from '../../../types/IProduct'
import {
  validateExistCodeFs,
  validateFields,
  validateFileJson,
  validateOther,
  validateType
} from '../../../utils/validations'

const filePath = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'store',
  'products.json'
)

class ProductService {
  path: string

  constructor() {
    this.path = filePath
  }

  async getProducts({
    page = '',
    limit = '',
    sort = '',
    query = ''
  }: ProductProps): Promise<any> {
    // validacion si existe el archivo products.json
    validateFileJson(this.path)

    const dataJSON = await fs.promises.readFile(this.path, 'utf-8')
    if (dataJSON === undefined) {
      throw new Error('Productos no encontrados')
    }
    const data = {
      docs: JSON.parse(dataJSON)
    }
    return { ...data }
  }

  async getProductById(id: string): Promise<IProduct> {
    try {
      if (id === undefined) throw new Error('Falta el Id del producto')

      const products = await this.getProducts({
        page: '',
        limit: '',
        sort: '',
        query: ''
      })

      const productById = products.find(
        (product: IProduct) => product.id === id
      )
      if (productById === undefined) {
        throw new Error(`Producto con ID: ${id} no encontrado`)
      }
      return productById
    } catch (err: any) {
      return err.message
    }
  }

  async addProduct(product: IProduct): Promise<string> {
    try {
      // validacion de los campos y tipos
      validateFields(product)
      validateType(product)
      validateOther(product)

      // obtencion de la BD de products
      const products = await this.getProducts({
        page: '',
        limit: '',
        sort: '',
        query: ''
      })

      // validacion si existe el codigo en la lista
      validateExistCodeFs(product, products)

      // creacion de un id autoincrementable para el producto
      const id =
        products.length === 0
          ? 1
          : parseInt(products[products.length - 1].id as string) + 1

      // agregacion del producto a la lista de productos
      await fs.promises.writeFile(
        this.path,
        JSON.stringify([...products, { id, ...product }]),
        'utf-8'
      )
      return 'Producto agregado a products.json con éxito'
    } catch (err: any) {
      return err.message
    }
  }

  async updateProduct(id: string, newProduct: IProduct): Promise<string> {
    try {
      // validacion de los campos y tipos
      validateFields(newProduct)
      validateType(newProduct)
      validateOther(newProduct)

      if (id === undefined) throw new Error('Falta el Id del producto')

      // obtencion de la BD de products
      const products = await this.getProducts({
        page: '',
        limit: '',
        sort: '',
        query: ''
      })

      // validacion si existe el codigo en la lista
      const updateProd = products.find((prod: IProduct) => prod.id === id)
      if (updateProd == null) {
        throw new Error(
          `Producto con ID: "${id}" no se encontró en la lista, no se pudo actualizar!`
        )
      }

      // obtencion del indice del producto
      const productIndex = products.findIndex(
        (prod: IProduct) => prod.id === id
      )
      products[productIndex] = { ...updateProd, ...newProduct }

      // actualizando la lista de productos
      await fs.promises.writeFile(this.path, JSON.stringify(products))
      return `Producto con ID: ${id} actualizado con éxito!`
    } catch (error: any) {
      return error.message
    }
  }

  async deleteProduct(id: string): Promise<string> {
    try {
      if (id === undefined) throw new Error('Falta el Id del producto')
      // obtencion de la BD de products
      const products = await this.getProducts({
        page: '',
        limit: '',
        sort: '',
        query: ''
      })

      // validacion si existe el codigo en la lista
      const idProd = products.some((prod: IProduct) => prod.id === id)
      if (idProd === null) {
        throw new Error(
          `Producto con ID: "${id}" no se encontró en la lista, no se pudo eliminarlo!`
        )
      }

      // filtrando la lista de productos
      const productsF = products.filter((prod: IProduct) => prod.id !== id)

      // actualizando la lista de productos
      await fs.promises.writeFile(this.path, JSON.stringify(productsF))
      return `Producto con ID: "${id}" eliminado correctamente`
    } catch (error: any) {
      return error.message
    }
  }
}

export default ProductService
