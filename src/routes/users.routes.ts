import { Router } from 'express'
import {
  changeRolePremium,
  deleteUserById,
  getUsers
} from '../dao/controllers/user.controller'
import { authorization } from '../middlewares/authorization'

const router = Router()

router.get('/', authorization(['admin']), getUsers)
router.delete('/:uid', authorization(['admin']), deleteUserById)
router.post('/premium/:uid', authorization(['admin']), changeRolePremium)

export default router
