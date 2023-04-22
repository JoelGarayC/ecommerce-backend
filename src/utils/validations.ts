import { type Request } from 'express'
import mongoose from 'mongoose'
import { Cart } from '../dao/mongo/models/Cart'
import { Product } from '../dao/mongo/models/Product'
import { type IProduct, type IThumbnail } from '../types/IProduct'
import { type IUser } from '../types/IUser'
import { CustomError } from './CustomError'
const { ObjectId } = mongoose.Types

export function validateFields(product: IProduct): void {
  const requiredFields: Array<keyof IProduct> = [
    'title',
    'description',
    'price',
    'code',
    'stock',
    'category',
    'status'
  ]

  for (const field of requiredFields) {
    if (
      product[field] === undefined ||
      product[field] === null ||
      product[field] === ''
    ) {
      throw new CustomError(`El campo: ${field} es requerido`, 400)
    }
  }
}

export function validateType(product: IProduct): void {
  const validateFieldsNumber: Array<keyof IProduct> = ['price', 'stock']
  const validateFieldsString: Array<keyof IProduct> = [
    'title',
    'description',
    'code',
    'category'
  ]

  for (const field of validateFieldsNumber) {
    if (typeof product[field] !== 'number') {
      throw new CustomError(
        `El campo: ${field} deber ser de tipo numérico`,
        400
      )
    }
  }

  for (const field of validateFieldsString) {
    if (typeof product[field] !== 'string') {
      throw new CustomError(`El campo: ${field} deber ser de tipo string`, 400)
    }
  }
}

export function validateOther(product: IProduct): void {
  if (product.price < 0) {
    throw new CustomError(
      'El campo: price no puede ser un numero negativo',
      400
    )
  }

  if (product.stock < 0 || product.stock % 1 !== 0) {
    throw new CustomError(
      'El campo: stock deber ser un número entero o no puede ser un numero negativo',
      400
    )
  }
}

/*  otras validaciones */

export async function validateIdProduct(idProduct: string): Promise<void> {
  if (!ObjectId.isValid(idProduct)) {
    throw new CustomError(`El ID: ${idProduct}, no es válido`, 400)
  }

  const productById = await Product.findById(idProduct)
  if (productById === null) {
    throw new CustomError(
      `No se encontró el producto con ID: ${idProduct} `,
      404
    )
  }
}

export async function validateIdCart(idCart: string): Promise<void> {
  if (!ObjectId.isValid(idCart)) {
    throw new CustomError(`El ID: ${idCart} del carrito no es válido`, 400)
  }

  const cartById = await Cart.findById(idCart)
  if (cartById === null) {
    throw new CustomError(`No se encontró el carrito con ID: ${idCart}`, 404)
  }
}

export function imagesValidate(req: Request): IThumbnail[] {
  if (!Array.isArray(req.files)) return []

  const dataImages = (): IThumbnail[] | undefined => {
    if (Array.isArray(req.files)) {
      return req.files?.map((file: any) => ({
        name: file.originalname,
        path: file.path
      }))
    } else {
      return req.files?.thumbnails.map((file: any) => ({
        name: file.originalname,
        path: file.path
      }))
    }
  }

  const images = dataImages()?.map((image) => {
    const startIndex = image.path.indexOf('images')
    const imgPath = image.path.slice(startIndex).replace(/\\/g, '/')
    const imagePath = `/${imgPath}`
    return {
      name: image.name,
      path: imagePath
    }
  })

  return images ?? []
}

export function saveImagesUrl(req: Request): IThumbnail[] {
  const dataImages = (): IThumbnail[] | undefined => {
    if (Array.isArray(req.files)) {
      return req.files?.map((file: any) => ({
        name: file.originalname,
        path: file.path
      }))
    } else {
      return req.files?.thumbnails.map((file: any) => ({
        name: file.originalname,
        path: file.path
      }))
    }
  }

  const images = dataImages()?.map((image) => {
    const startIndex = image.path.indexOf('images')
    const imgPath = image.path.slice(startIndex).replace(/\\/g, '/')
    const imagePath = `/${imgPath}`
    return {
      name: image.name,
      path: imagePath
    }
  })

  return images ?? []
}

// export function validateExistCodeFs(
//   product: IProduct,
//   products: IProduct[]
// ): void {
//   if (products?.length === 0) {
//     throw new Error('No se ha encontrado ningún producto')
//   }
//   const codeExists = products.some((prod) => prod.code === product.code)
//   if (codeExists) {
//     throw new Error(
//       `El código "${product.code}" ya existe en la lista, escribe otro!`
//     )
//   }
// }

export function validateFieldsUser(user: IUser): void {
  const requiredFields: Array<keyof IUser> = [
    'firstName',
    'lastName',
    'email',
    'password',
    'role'
  ]

  for (const field of requiredFields) {
    if (
      user[field] === undefined ||
      user[field] === null ||
      user[field] === ''
    ) {
      throw new CustomError(`El campo: ${field} es requerido`, 400)
    }
  }
}

export function validateTypeUser(user: IUser): void {
  const validateFieldsString: Array<keyof IUser> = ['firstName', 'lastName']

  for (const field of validateFieldsString) {
    if (typeof user[field] !== 'string') {
      throw new CustomError(`El campo: ${field} deber ser de tipo string`, 400)
    }
  }
}

export function validateFieldsUserLogin(user: IUser): void {
  const requiredFields: Array<keyof IUser> = ['email', 'password']

  for (const field of requiredFields) {
    if (
      user[field] === undefined ||
      user[field] === null ||
      user[field] === ''
    ) {
      throw new CustomError(`El campo: ${field} es requerido`, 400)
    }
  }
}
