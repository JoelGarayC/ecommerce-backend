import { Router } from 'express'
import {
  changeRolePremium,
  deleteUserById,
  getUsers,
  uploadDocuments
} from '../dao/controllers/user.controller'
import { authorization } from '../middlewares/authorization'
import { uploaderDocs } from '../middlewares/uploaderImagesFs'

const router = Router()

router.get('/', authorization(['admin']), getUsers)
router.delete('/:uid', authorization(['admin']), deleteUserById)
router.post('/:uid/documents', uploaderDocs.array('documents'), uploadDocuments)
router.post('/premium/:uid', authorization(['admin']), changeRolePremium)

export default router
