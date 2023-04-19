import { Router } from 'express'
import { register } from '../dao/mongoDb/controllers/user.controller'

const router = Router()

router.post('/register', register)

export default router
