import { type Request, type Response } from 'express'
import { responseCustomError } from '../../utils/CustomError'
import CartService from '../mongo/services/cart.service'
import ProductService from '../mongo/services/product.service'
import UserService from '../mongo/services/user.service'

const product = new ProductService()
const cart = new CartService()
const user = new UserService()

export async function getProducts(req: any, res: Response): Promise<void> {
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

export async function getProductsById(req: any, res: Response): Promise<void> {
  const { pid } = req.params

  try {
    const data = await product.getProductById(pid)

    // optiene el id del carrito del usuario logueado
    const { uid } = req.user
    const { cart } = await user.getUserById(uid)

    res.render('productsDetails', { data, cart })
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
    const data = cartData

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
    res.redirect('/login')
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    res.render('login')
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function register(_req: Request, res: Response): Promise<void> {
  try {
    res.render('register')
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function profile(req: any, res: Response): Promise<void> {
  const { uid } = req.user
  try {
    const data = await user.getUserById(uid)
    const isAdmin = req.user?.role === 'admin'
    const isPremium = req.user?.role === 'premium'

    res.render('profile', {
      data,
      isAdmin,
      isPremium
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function recoveryPassword(
  _req: any,
  res: Response
): Promise<void> {
  try {
    res.render('recoveryPassword')
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function resetPassword(req: any, res: Response): Promise<void> {
  const { token } = req.query
  try {
    res.render('resetPassword', {
      token
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}

export async function dashboard(_req: Request, res: Response): Promise<void> {
  try {
    const users = await user.getUsers()
    res.render('dashboard', {
      users
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}
