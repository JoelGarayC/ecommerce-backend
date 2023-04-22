import { Router } from 'express'
import {
  current,
  login,
  logout,
  register
} from '../dao/mongo/controllers/session.controller'
import { verifyCart } from '../middlewares/verifyCart'
import verifyToken from '../middlewares/verifyToken'

const router = Router()

router.post('/register', verifyCart, register)
router.post('/login', verifyCart, login)
router.get('/current', verifyToken(['admin', 'user']), current)
router.post('/logout', logout)

export default router
