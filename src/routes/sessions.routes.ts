import { Router } from 'express'
import {
  current,
  login,
  register
} from '../dao/mongoDb/controllers/user.controller'
import verifyToken from '../middlewares/verifyToken'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/current', verifyToken, current)

export default router
