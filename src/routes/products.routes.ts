import { Router } from 'express'
import {
  addProduct,
  deleteProductById,
  getProductById,
  getProducts,
  updateProductById
} from '../dao/controllers/product.controller'
import { authorization } from '../middlewares/authorization'
import { uploader } from '../middlewares/uploaderImages'

const router = Router()

router
  .route('/')
  .get(getProducts)
  .post(uploader.array('thumbnails'), authorization(['admin']), addProduct)

router
  .route('/:pid')
  .get(getProductById)
  .put(
    uploader.array('thumbnails'),
    authorization(['admin']),
    updateProductById
  )
  .delete(authorization(['admin']), deleteProductById)

export default router
