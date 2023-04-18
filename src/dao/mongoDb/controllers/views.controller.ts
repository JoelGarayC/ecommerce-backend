import { type Request, type Response } from 'express'
import { responseCustomError } from '../../../utils/CustomError'
import CartManager from '../managers/CartManager'
import ProductManager from '../managers/ProductManager'

const product = new ProductManager()
const cart = new CartManager()

export async function getProducts(req: Request, res: Response): Promise<void> {
  const limit = req.query.limit as string
  const page = req.query.page as string
  const sort = req.query.sort as string
  const query = req.query.query as string

  try {
    const data = await product.getProducts({ limit, page, sort, query })

    res.render('products', {
      products: data.docs,
      prevPage: data.prevPage,
      nextPage: data.nextPage,
      limit,
      sort,
      query
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function getProductsById(
  req: Request,
  res: Response
): Promise<void> {
  const { pid } = req.params

  try {
    const data = await product.getProductById(pid)

    res.render('productsDetails', { data })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function addProduct(_req: Request, res: Response): Promise<void> {
  try {
    res.render('addProduct')
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function getCartId(req: Request, res: Response): Promise<void> {
  const { cid } = req.params

  try {
    const cartData = await cart.getCartById(cid)
    const data = cartData.products

    res.render('cart', { data })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function chat(_req: Request, res: Response): Promise<void> {
  try {
    res.render('chat')
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function homePage(_req: Request, res: Response): Promise<void> {
  try {
    res.redirect('/products')
  } catch (err) {
    responseCustomError(res, err)
  }
}
