import { Router } from 'express'
import {
  changeRolePremium,
  deleteUserById,
  getUsers
} from '../dao/controllers/user.controller'
import { authorization } from '../middlewares/authorization'

const router = Router()

router.get('/', authorization(['admin']), getUsers)
router.post('/premium/:uid', authorization(['admin']), changeRolePremium)
router.delete('/:uid', authorization(['admin']), deleteUserById)

export default router
