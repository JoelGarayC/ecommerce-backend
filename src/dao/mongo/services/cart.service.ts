import type mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { type ICart, type ICartItem } from '../../../types/ICart'
import { type ITicket } from '../../../types/ITicket'
import { CustomError, errDictionary } from '../../../utils/CustomError'
import { sendConfirmEmail } from '../../../utils/sendConfirmEmail'
import { validateIdCart, validateIdProduct } from '../../../utils/validations'
import { Cart } from '../models/Cart'
import { Product } from '../models/Product'
import { Ticket } from '../models/Ticket'
import { User } from '../models/User'

interface ReturnCart {
  message: string
  id: mongoose.Types.ObjectId
}

interface ReturnCheckProd {
  stock: number
  price: number
}

interface ReturnPurchased {
  purchasedProducts: string[]
  unPurchasedProducts: string[]
  totalAmount: number
}

interface ReturnPurchasedAndTicket extends ReturnPurchased {
  ticket?: ITicket
  ammount?: number
}

class CartService {
  async getCarts(): Promise<ICart[]> {
    const data = await Cart.find().lean()
    return data
  }

  async getCartById(id: string): Promise<ICart> {
    await validateIdCart(id)

    const cartById = await Cart.findById(id).populate('products.product')
    if (cartById === null) {
      throw new CustomError(errDictionary.CART_PRODUCTS_NOT_FOUND, 404)
    }
    return cartById
  }

  async addCart(): Promise<ReturnCart> {
    const newCart = new Cart({
      products: []
    })
    const res = await newCart.save()
    return { message: 'Carrito agregado con éxito: []', id: res._id }
  }

  async addProduct(idCart: string, idProduct: string): Promise<string> {
    await validateIdCart(idCart)
    await validateIdProduct(idProduct)

    const cartById = await Cart.findById(idCart)
    if (cartById === null) {
      throw new CustomError(errDictionary.CART_NOT_FOUND, 404)
    }

    // verificar q exista stock del productp
    const existStock = await Product.findById(idProduct)
    if (existStock?.stock !== undefined) {
      if (existStock.stock < 1) {
        throw new CustomError('No hay suficiente stock del producto', 402)
      }
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
      return 'Producto agregado al carrito con éxito denuevo!'
    }

    // Si el producto no existe en el carrito, se agrega con una cantidad de 1
    cartById.products.push({
      product: idProduct,
      quantity: 1
    })

    await cartById.save()
    return 'Producto agregado al carrito con éxito!'
  }

  async updateProduct(
    idCart: string,
    idProduct: string,
    quantity: string
  ): Promise<string> {
    if (quantity === undefined) {
      throw new CustomError(errDictionary.MISSING_QUANTITY_FORMAT, 400)
    }
    await validateIdCart(idCart)
    await validateIdProduct(idProduct)

    const existProdinCart = await Cart.findOne({
      _id: idCart,
      'products.product': idProduct
    })
    if (existProdinCart === null) {
      throw new CustomError(errDictionary.PRODUCT_NOT_FOUND_IN_CART, 404)
    }

    // Si el producto ya existe en el carrito, se actualiza la cantidad
    await Cart.findOneAndUpdate(
      {
        _id: idCart,
        'products.product': idProduct
      },
      {
        $set: { 'products.$.quantity': parseInt(quantity) }
      }
    )
    return 'Producto actualizado con éxito en el carrito'
  }

  async updateProducts(idCart: string, products: unknown[]): Promise<string> {
    await validateIdCart(idCart)

    if (!Array.isArray(products)) {
      throw new CustomError(errDictionary.INVALID_PRODUCTS_ARRAY, 400)
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
      throw new CustomError(errDictionary.PRODUCT_NOT_FOUND_IN_CART, 404)
    }

    // Eliminando el producto con id del carrito
    await Cart.updateOne(
      { _id: idCart },
      { $pull: { products: { product: idProduct } } }
    )
    return 'Producto eliminado del carrito correctamente!'
  }

  async deleteProducts(idCart: string): Promise<string> {
    await validateIdCart(idCart)

    const cart = await Cart.findOne({ _id: idCart }).populate(
      'products.product'
    )
    if (cart === null) {
      throw new CustomError(errDictionary.CART_NOT_FOUND, 404)
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

  async purchase(
    idCart: string,
    idUser: string
  ): Promise<ReturnPurchasedAndTicket> {
    await validateIdCart(idCart)
    const cartById = await Cart.findById(idCart)
    if (cartById === null) {
      throw new CustomError(
        `Carrito con ID: ${idCart}, no se encontró los productos`,
        400
      )
    }
    const data = await checkCartStock(cartById)

    if (
      data.totalAmount === 0 &&
      data.unPurchasedProducts.length === 0 &&
      data.purchasedProducts.length === 0
    ) {
      throw new CustomError('No hay productos en el carrito', 400)
    }

    // actualizar el carrito del usuario, con los productos
    // que no pudieron ser comprados
    const user = await User.findById(idUser)
    if (data.unPurchasedProducts.length > 0) {
      if (user !== null) {
        const idCart = user.cart
        // eliminamos del carrito los productos comprados
        await Cart.updateOne(
          { _id: idCart },
          {
            $pull: { products: { product: { $in: data.purchasedProducts } } }
          }
        )
      }
    }

    // crear el ticket si hay productos comprados
    if (data.purchasedProducts.length > 0) {
      const code = uuidv4()
      const ticket = await Ticket.create({
        code,
        amount: data.totalAmount,
        purchaser: user?.email,
        purchase_datetime: Date.now()
      })
      await sendConfirmEmail(user?.email as string, code, data.totalAmount)
      return { ...data, ticket }
    }

    return { ...data }
  }
}

async function checkCartStock(cartData: ICart): Promise<ReturnPurchased> {
  // productos comprados y productos no comprados
  const purchasedProducts: string[] = []
  const unPurchasedProducts: string[] = []
  let totalAmount = 0

  for (const item of cartData.products) {
    const productId = item.product
    const quantity = item.quantity

    const { stock, price } = await checkProductStock(productId, quantity)

    // agrega solo los que tiene stock o solo los que se pueden comprar
    if (stock > 0) {
      purchasedProducts.push(productId)
      totalAmount += price * quantity
    } else {
      unPurchasedProducts.push(productId)
    }
  }

  return { purchasedProducts, unPurchasedProducts, totalAmount }
}

async function checkProductStock(
  productId: string,
  quantity: number
): Promise<ReturnCheckProd> {
  const itemProduct = await Product.findById(productId)

  if (itemProduct === null) {
    return { stock: 0, price: 0 }
  }

  // Lógica para obtener la información del producto y verificar el stock
  // Devuelve si hay suficiente stock para la cantidad dada

  if (itemProduct.stock >= quantity) {
    // actualizando el stock del producto
    const newStock = itemProduct.stock - quantity
    const data = await Product.findByIdAndUpdate(productId, { stock: newStock })
    if (data !== null) {
      return { stock: data.stock, price: data.price }
    }
  }
  return { stock: 0, price: 0 }
}

export default CartService
