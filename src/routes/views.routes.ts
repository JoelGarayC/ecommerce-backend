import { Router } from 'express'

import {
  addProduct,
  chat,
  dashboard,
  getCartId,
  getProducts,
  getProductsById,
  homePage,
  login,
  profile,
  recoveryPassword,
  register,
  resetPassword
} from '../dao/controllers/views.controller'
import { authorization } from '../middlewares/authorization'

const router = Router()

router.get('/login', login)
router.get('/register', register)
router.get('/recoveryPassword', recoveryPassword)
router.get('/resetPassword', resetPassword)
router.get('/profile', authorization(['admin', 'user', 'premium']), profile)

router.get('/products', getProducts)
router.get(
  '/products/:pid',
  authorization(['admin', 'user', 'premium']),
  getProductsById
)

router.get('/addProduct', authorization(['admin', 'premium']), addProduct)
router.get('/dashboard', authorization(['admin']), dashboard)
router.get(
  '/carts/:cid',
  authorization(['admin', 'user', 'premium']),
  getCartId
)

router.get('/chat', chat)

router.get('/', homePage)

export default router
