import express from 'express'
import {
  addCart,
  addProductToCart,
  deleteProductToCart,
  deleteProductsToCart,
  getCartById,
  getCarts,
  updateProductToCart,
  updateProductsToCart
} from '../dao/mongoDb/controllers/cart.controller'

const router = express.Router()

router.route('/').get(getCarts).post(addCart)

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
