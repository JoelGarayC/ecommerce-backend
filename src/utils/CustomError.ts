import { type Response } from 'express'
import { logger } from './logger'

export const errDictionary = {
  INVALID_PRODUCT_ID: 'El id del producto no es válido',
  PRODUCT_NOT_FOUND: 'El producto no se encontró',
  PRODUCT_ALREADY_EXISTS: 'El producto ya existe en el carrito',
  CART_PRODUCTS_NOT_FOUND: 'No se encontraron productos en el carrito',
  INVALID_CART_ID: 'El id del carrito no es válido',
  CART_NOT_FOUND: 'El carrito no se encontró',
  PRODUCT_NOT_FOUND_IN_CART: 'El producto no se encontró en el carrito',
  INVALID_PRODUCTS_ARRAY: 'Los productos deben ser un array válido',
  MISSING_QUANTITY_FORMAT:
    'Escribe la cantidad de ejemplares del producto en el "body", FORMATO: { \'quantity\': valor }'
}

export class CustomError extends Error {
  statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

export const responseCustomError = (res: Response, err: any): void => {
  const statusCode = err.statusCode ?? 500
  if (statusCode === 500) {
    logger.warn(err.message)
  }
  const message = statusCode === 500 ? 'Error en el servidor' : err.message

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message
  })
}
