import { Router } from 'express'

import {
  addProduct,
  chat,
  getCartId,
  getProducts,
  getProductsById,
  homePage
} from '../dao/mongoDb/controllers/views.controller'

const router = Router()

router.get('/products', getProducts)
router.get('/products/:pid', getProductsById)
router.get('/addProduct', addProduct)
router.get('/carts/:cid', getCartId)
router.get('/chat', chat)
router.get('/', homePage)

export default router
