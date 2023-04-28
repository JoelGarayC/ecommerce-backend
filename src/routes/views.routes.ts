import { Router } from 'express'

import {
  addProduct,
  chat,
  getCartId,
  getProducts,
  getProductsById,
  homePage,
  login,
  profile,
  register
} from '../dao/mongo/controllers/views.controller'
import { authorization } from '../middlewares/authorization'

const router = Router()

router.get('/login', login)
router.get('/register', register)
router.get('/profile', authorization(['admin', 'user']), profile)

router.get('/products', getProducts)
router.get('/products/:pid', authorization(['admin', 'user']), getProductsById)

router.get('/addProduct', addProduct)
router.get('/carts/:cid', getCartId)

router.get('/chat', chat)
router.get('/', homePage)

export default router
