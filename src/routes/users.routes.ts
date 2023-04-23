import { Router } from 'express'
import {
  deleteUserById,
  getUsers
} from '../dao/mongo/controllers/user.controller'
import verifyToken from '../middlewares/authorization'

const router = Router()

router.get('/', verifyToken(['admin']), getUsers)
router.delete('/:uid', verifyToken(['admin']), deleteUserById)

export default router
