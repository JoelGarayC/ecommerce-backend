import { type Request, type Response } from 'express'
import { CustomError, responseCustomError } from '../../utils/CustomError'
import CartService from '../mongo/services/cart.service'
import ProductService from '../mongo/services/product.service'

const cart = new CartService()
const product = new ProductService()

export async function getCarts(_req: Request, res: Response): Promise<void> {
  try {
    const data = await cart.getCarts()
    res.status(200).json({
      status: 'success',
      carts: data
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function getCartById(req: Request, res: Response): Promise<void> {
  const { cid } = req.params

  try {
    const data = await cart.getCartById(cid)
    res.status(200).json({
      status: 'success',
      cart: data
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function addCart(_req: Request, res: Response): Promise<void> {
  try {
    const data = await cart.addCart()
    res.status(200).json({
      status: 'success',
      message: data.message
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function addProductToCart(req: any, res: Response): Promise<void> {
  const { cid, pid } = req.params
  const role = req.user?.role
  const userId = req.user?.uid

  try {
    if (role === 'premium') {
      // Obtener el producto por su ID
      const productId = await product.getProductById(pid)
      if (productId?.owner === userId) {
        throw new CustomError(
          'Acceso denegado. No puedes agregar un producto que te pertenece',
          403
        )
      }
    }

    const data = await cart.addProduct(cid, pid)
    res.status(200).json({
      status: 'success',
      message: data
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function updateProductToCart(
  req: Request,
  res: Response
): Promise<void> {
  const { cid, pid } = req.params
  const { quantity } = req.body

  try {
    const data = await cart.updateProduct(cid, pid, quantity)
    res.status(200).json({
      status: 'success',
      message: data
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function updateProductsToCart(
  req: Request,
  res: Response
): Promise<void> {
  const { cid } = req.params

  try {
    const data = await cart.updateProducts(cid, req.body)
    res.status(200).json({
      status: 'success',
      message: data
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function deleteProductToCart(
  req: Request,
  res: Response
): Promise<void> {
  const { cid, pid } = req.params
  try {
    const data = await cart.deleteProduct(cid, pid)
    res.status(200).json({
      status: 'success',
      message: data
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function deleteProductsToCart(
  req: Request,
  res: Response
): Promise<void> {
  const { cid } = req.params
  try {
    const data = await cart.deleteProducts(cid)
    res.status(200).json({
      status: 'success',
      message: data
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function purchase(req: any, res: Response): Promise<void> {
  const { cid } = req.params
  const { uid } = req.user
  try {
    const data = await cart.purchase(cid, uid)
    if (
      data.unPurchasedProducts.length > 0 &&
      data.purchasedProducts.length === 0
    ) {
      res.status(200).json({
        status: 'success',
        message: 'Compra no completada',
        unPurchaseProducts: data.unPurchasedProducts
      })
    } else if (data.unPurchasedProducts.length > 0) {
      res.status(200).json({
        status: 'success',
        message:
          'Compra completada, pero algunos productos no pudieron comprarse',
        ticket: data.ticket,
        purchaseProducts: data.purchasedProducts,
        unPurchaseProducts: data.unPurchasedProducts
      })
    } else {
      res.status(200).json({
        status: 'success',
        message: 'Compra realizada con éxito',
        ticket: data.ticket,
        purchaseProducts: data.purchasedProducts
      })
    }
  } catch (err) {
    responseCustomError(res, err)
  }
}
