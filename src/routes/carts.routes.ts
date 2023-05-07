import { Router } from 'express'
import {
  addCart,
  addProductToCart,
  deleteProductToCart,
  deleteProductsToCart,
  getCartById,
  getCarts,
  purchase,
  updateProductToCart,
  updateProductsToCart
} from '../dao/controllers/cart.controller'
import { authorization } from '../middlewares/authorization'

const router = Router()

router
  .route('/')
  .get(authorization(['admin']), getCarts)
  .post(addCart)

router
  .route('/:cid')
  .get(authorization(['admin', 'user']), getCartById)
  .put(authorization(['admin', 'user']), updateProductsToCart)
  .delete(authorization(['admin', 'user']), deleteProductsToCart)

router
  .route('/:cid/products/:pid')
  .post(authorization(['admin', 'user']), addProductToCart)
  .put(authorization(['admin', 'user']), updateProductToCart)
  .delete(authorization(['admin', 'user']), deleteProductToCart)

router.post('/:cid/purchase', authorization(['admin', 'user']), purchase)

export default router
