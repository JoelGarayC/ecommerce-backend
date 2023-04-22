import { type Request, type Response } from 'express'
import { responseCustomError } from '../../../utils/CustomError'
import CartService from '../services/cart.service'

const cart = new CartService()

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

export async function addProductToCart(
  req: Request,
  res: Response
): Promise<void> {
  const { cid, pid } = req.params

  try {
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
