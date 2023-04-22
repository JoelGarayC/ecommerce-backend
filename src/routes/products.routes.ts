import { Router } from 'express'
import {
  addProduct,
  deleteProductById,
  getProductById,
  getProducts,
  updateProductById
} from '../dao/mongo/controllers/product.controller'
import { uploader } from '../middlewares/uploaderImages'
import verifyToken from '../middlewares/verifyToken'

const router = Router()

router
  .route('/')
  .get(getProducts)
  .post(uploader.array('thumbnails'), verifyToken(['admin']), addProduct)

router
  .route('/:pid')
  .get(getProductById)
  .put(uploader.array('thumbnails'), updateProductById)
  .delete(deleteProductById)

export default router
