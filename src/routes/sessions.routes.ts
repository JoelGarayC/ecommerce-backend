import { Router } from 'express'
import {
  current,
  login,
  logout,
  register
} from '../dao/mongo/controllers/session.controller'
import authorization from '../middlewares/authorization'
import { verifyCart } from '../middlewares/verifyCart'
import { validateLoginBody, validateRegisterBody } from '../utils/validations'
import { validatorExpressError } from './validatorError'

const router = Router()

router.post('/register', validateRegisterBody, validatorExpressError, register)
router.post(
  '/login',
  validateLoginBody,
  validatorExpressError,
  verifyCart,
  login
)
router.get('/current', authorization(['admin', 'user']), current)
router.post('/logout', authorization(['admin', 'user']), logout)

export default router
