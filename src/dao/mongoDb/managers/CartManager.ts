import { type ICart, type ICartItem } from '../../../types/ICart'
import { CustomError } from '../../../utils/CustomError'
import { validateIdCart, validateIdProduct } from '../../../utils/validations'
import { Cart } from '../models/Cart'
import { Product } from '../models/Product'

class CartManager {
  async getCarts(): Promise<ICart[]> {
    const data = await Cart.find()
    return data
  }

  async getCartById(id: string): Promise<ICart> {
    await validateIdCart(id)

    const cartById = await Cart.findById(id).populate('products.product')
    if (cartById === null) {
      throw new CustomError(
        `Carrito con ID: ${id}, no se encontró los productos`,
        404
      )
    }
    return cartById
  }

  async addCart(): Promise<string> {
    const newCart = new Cart({
      products: []
    })
    await newCart.save()
    return 'Carrito agregado con éxito: []'
  }

  async addProduct(idCart: string, idProduct: string): Promise<string> {
    await validateIdCart(idCart)
    await validateIdProduct(idProduct)

    const cartById = await Cart.findById(idCart)
    if (cartById === null) {
      throw new CustomError(`No se encontró el carrito con ID: ${idCart}`, 404)
    }

    // Verificar si el producto ya existe en el carrito, si existe aumente el quantity
    const existProdinCart = await Cart.findOne({
      _id: idCart,
      'products.product': idProduct
    })

    if (existProdinCart !== null) {
      // Si el producto ya existe en el carrito, se actualiza la cantidad
      await Cart.findOneAndUpdate(
        {
          _id: idCart,
          'products.product': idProduct
        },
        {
          $inc: { 'products.$.quantity': 1 }
        }
      )
      return 'Producto agregado al carrito con éxito y aumentó el valor de quantity'
    }

    // Si el producto no existe en el carrito, se agrega con una cantidad de 1
    cartById.products.push({
      product: idProduct,
      quantity: 1
    })

    await cartById.save()
    return 'Producto agregado al carrito con éxito'
  }

  async updateProduct(
    idCart: string,
    idProduct: string,
    quantity: any
  ): Promise<string> {
    if (quantity === undefined) {
      throw new CustomError(
        'Escribe la cantidad de ejemplares del producto en el "body", FORMATO: { \'quantity\': valor }',
        400
      )
    }
    await validateIdCart(idCart)
    await validateIdProduct(idProduct)

    const existProdinCart = await Cart.findOne({
      _id: idCart,
      'products.product': idProduct
    })
    if (existProdinCart === null) {
      throw new CustomError(
        `El Producto con ID: ${idProduct} no se encontró en el carrito`,
        404
      )
    }

    // Si el producto ya existe en el carrito, se actualiza la cantidad
    await Cart.findOneAndUpdate(
      {
        _id: idCart,
        'products.product': idProduct
      },
      {
        $set: { 'products.$.quantity': quantity }
      }
    )
    return 'Producto actualizado con éxito en el carrito'
  }

  async updateProducts(idCart: string, products: unknown[]): Promise<string> {
    await validateIdCart(idCart)

    if (!Array.isArray(products)) {
      throw new CustomError('Los productos deben ser un array válido', 400)
    }

    // validacion del arreglo de productos, de acueerdo al formato
    const isValid = products.every(
      (obj: unknown): obj is ICartItem =>
        typeof obj === 'object' &&
        obj !== null &&
        'product' in obj &&
        'quantity' in obj &&
        Number.isInteger(obj.quantity)
    )
    if (!isValid) {
      throw new CustomError(
        "Escribe un formato (arreglo de productos) válido; ejemplo: [{'product':'idValidodelProducto','quantity': 2},{'product': 'idDelProd','quantity': 1}]",
        400
      )
    }

    // validacion de que todos los productos existen en la bd
    const productIds = products.map((obj: ICartItem) => obj.product)
    const areProductsValid = await Product.find({
      _id: { $in: productIds }
    })
    const isValidProducts = areProductsValid.length === products.length
    if (!isValidProducts) {
      throw new CustomError(
        'Uno o más IDs de los productos no existen en la base de datos',
        404
      )
    }

    await Cart.updateOne({ _id: idCart }, { $set: { products } })
    return 'Todos los productos actualizados correctamente'
  }

  async deleteProduct(idCart: string, idProduct: string): Promise<string> {
    await validateIdCart(idCart)
    await validateIdProduct(idProduct)

    const existProdinCart = await Cart.findOne({
      _id: idCart,
      'products.product': idProduct
    })
    if (existProdinCart === null) {
      throw new CustomError(
        `El Producto con ID: ${idProduct} no se encontró en el carrito`,
        404
      )
    }

    // Eliminando el producto con id del carrito
    await Cart.updateOne(
      { _id: idCart },
      { $pull: { products: { product: idProduct } } }
    )
    return `Producto con ID: ${idProduct} eliminado del carrito correctamente`
  }

  async deleteProducts(idCart: string): Promise<string> {
    await validateIdCart(idCart)

    const cart = await Cart.findOne({ _id: idCart }).populate(
      'products.product'
    )
    if (cart === null) {
      throw new CustomError(`No se encontró el carrito con ID: ${idCart}`, 404)
    }

    const productsInCart = cart.products
    if (productsInCart.length === 0) {
      throw new CustomError(
        'No existe productos en el carrito para eliminar',
        404
      )
    }

    await Cart.updateOne({ _id: idCart }, { $set: { products: [] } })
    return 'Todos los productos del carrito eliminados correctamente'
  }
}

export default CartManager
