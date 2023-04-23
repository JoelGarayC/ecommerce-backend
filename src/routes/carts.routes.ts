import { Router } from 'express'
import {
  addCart,
  addProductToCart,
  deleteProductToCart,
  deleteProductsToCart,
  getCartById,
  getCarts,
  updateProductToCart,
  updateProductsToCart
} from '../dao/mongo/controllers/cart.controller'
import authorization from '../middlewares/authorization'

const router = Router()

router
  .route('/')
  .get(authorization(['admin']), getCarts)
  .post(addCart)

router
  .route('/:cid')
  .get(getCartById)
  .put(updateProductsToCart)
  .delete(deleteProductsToCart)

router
  .route('/:cid/products/:pid')
  .post(addProductToCart)
  .put(updateProductToCart)
  .delete(deleteProductToCart)

export default router
