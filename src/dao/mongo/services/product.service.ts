import mongoose, { type PaginateResult } from 'mongoose'
import { api } from '../../../config'
import { type IProduct, type ProductProps } from '../../../types/IProduct'
import { CustomError, errDictionary } from '../../../utils/CustomError'
import { sendDelProdPremium } from '../../../utils/sendDelProdPremium'
import {
  validateFields,
  validateIdProduct,
  validateOther,
  validateType
} from '../../../utils/validations'
import { Product } from '../models/Product'
import { User } from '../models/User'
const { ObjectId } = mongoose.Types

class ProductService {
  async getProducts({
    page = '',
    limit = '',
    sort = '',
    query = ''
  }: ProductProps): Promise<PaginateResult<IProduct>> {
    const queryPag =
      query.length > 0 ? { category: query.toLocaleLowerCase() } : {}
    const options = {
      page: page.length > 0 ? parseInt(page) : 1,
      limit: limit.length > 0 ? parseInt(limit) : 10,
      sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : ''
    }

    const response = await Product.paginate(queryPag, options)

    const links = {
      prevUrl: `${api.url}/products?page=${options.page - 1}&limit=${
        options.limit
      }&sort=${sort}&query=${query.toLocaleLowerCase()}`,
      nextUrl: `${api.url}/products?page=${options.page + 1}&limit=${
        options.limit
      }&sort=${sort}&query=${query.toLocaleLowerCase()}`
    }

    const data = { ...response, ...links }
    return data
  }

  async getProductById(id: string): Promise<IProduct> {
    if (!ObjectId.isValid(id)) {
      throw new CustomError(errDictionary.INVALID_PRODUCT_ID, 400)
    }

    const productById = await Product.findById(id).lean()
    if (productById === null) {
      throw new CustomError(errDictionary.PRODUCT_NOT_FOUND, 404)
    }
    return productById
  }

  async addProduct(product: IProduct): Promise<string> {
    // validacion de los campos y tipos
    validateFields(product)
    validateType(product)
    validateOther(product)

    const { title, code } = product

    // validacion del nombre de producto
    const productTitle = await Product.findOne({ title }).lean()
    if (productTitle !== null) {
      throw new CustomError(
        'El título del producto ya existe, escribe otro!',
        400
      )
    }

    // validacion si existe el codigo en la lista
    const productCode = await Product.findOne({ code }).lean()
    if (productCode !== null) {
      throw new CustomError(
        `El código: ${code} ya existe en la lista, escribe otro!`,
        400
      )
    }

    // agregacion de producto
    const newProduct = new Product(product)
    await newProduct.save()

    return 'Producto agregado con éxito'
  }

  async updateProduct(id: string, newProduct: IProduct): Promise<string> {
    await validateIdProduct(id)

    // validacion de los campos y tipos
    validateFields(newProduct)
    validateType(newProduct)
    validateOther(newProduct)

    // validacion del nombre de producto, exluye el producto ingresado
    const productTitle = await Product.findOne({
      _id: { $ne: id },
      title: newProduct.title
    }).lean()
    if (productTitle !== null) {
      throw new CustomError(
        'El título del producto ya existe, escribe otro!',
        400
      )
    }

    // validacion del code de producto, excluye el producto ingresado
    const productCode = await Product.findOne({
      _id: { $ne: id },
      code: newProduct.code
    }).lean()
    if (productCode !== null) {
      throw new CustomError(
        'El código del producto ya existe, escribe otro!',
        400
      )
    }

    // actualizar el producto
    await Product.findByIdAndUpdate(id, newProduct)
    return 'Producto actualizado con éxito!'
  }

  async deleteProduct(id: string): Promise<string> {
    await validateIdProduct(id)

    const deletedProduct = await Product.findByIdAndDelete(id)

    // verificar si el producto eliminado pertenece a un usuario premium
    // en tal caso, envia un email de confirmación
    if (deletedProduct?.owner !== 'admin') {
      const idPremium = deletedProduct?.owner
      const nameProduct = deletedProduct?.title as string
      const premium = await User.findById(idPremium)
      if (premium !== null) {
        await sendDelProdPremium(premium.email, nameProduct)
      }
    }
    return 'Producto eliminado correctamente'
  }
}

export default ProductService
