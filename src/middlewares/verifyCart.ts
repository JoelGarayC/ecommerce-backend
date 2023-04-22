import { type NextFunction, type Response } from 'express'
import { User } from '../dao/mongo/models/User'
import CartService from '../dao/mongo/services/cart.service'

const cart = new CartService()

export const verifyCart = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const email = req.body.email

    if (email === undefined) {
      throw new Error('El email es requerido')
    }

    const existInUser = await User.findOne({
      email,
      cart: { $exists: true }
    })

    // Si no existe el id del carrito en el id del usuario, entonces crea uno nuevo
    if (existInUser === null) {
      const { id: idCart } = await cart.addCart()

      // Busca al usuario por su identificador único y actualiza su propiedad 'cart'
      await User.findOneAndUpdate(
        { email },
        { $set: { cart: idCart } },
        { new: true }
      )
    }
    next()
  } catch (err: any) {
    res.status(401).json({
      status: 'error',
      statusCode: 401,
      message: err.message ?? 'No se pudo crear un carrito al usuario'
    })
  }
}
