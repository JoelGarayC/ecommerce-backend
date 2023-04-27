import { Router } from 'express'
import {
  deleteUserById,
  getUsers
} from '../dao/mongo/controllers/user.controller'
import { authorization } from '../middlewares/authorization'

const router = Router()

router.get('/', authorization(['admin']), getUsers)
router.delete('/:uid', authorization(['admin']), deleteUserById)

export default router
