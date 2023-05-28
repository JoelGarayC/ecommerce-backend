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
  .get(authorization(['admin', 'user', 'premium']), getCartById)
  .put(authorization(['admin', 'user', 'premium']), updateProductsToCart)
  .delete(authorization(['admin', 'user', 'premium']), deleteProductsToCart)

router
  .route('/:cid/products/:pid')
  .post(authorization(['admin', 'user', 'premium']), addProductToCart)
  .put(authorization(['admin', 'user', 'premium']), updateProductToCart)
  .delete(authorization(['admin', 'user', 'premium']), deleteProductToCart)

router.post('/:cid/purchase', authorization(['admin', 'user']), purchase)

export default router
