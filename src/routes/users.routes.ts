import { Router } from 'express'
import { getUsers } from '../dao/mongo/controllers/user.controller'
import verifyToken from '../middlewares/verifyToken'

const router = Router()

router.get('/', verifyToken(['admin']), getUsers)

export default router
