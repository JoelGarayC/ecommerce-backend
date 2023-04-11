import { Router } from 'express'
import {
  addProduct,
  deleteProductById,
  getProductById,
  getProducts,
  updateProductById
} from '../dao/mongoDb/controllers/product.controller'
import { uploader } from '../middlewares/uploaderImages'

const router = Router()

router
  .route('/')
  .get(getProducts)
  .post(uploader.array('thumbnails'), addProduct)

router
  .route('/:pid')
  .get(getProductById)
  .put(uploader.array('thumbnails'), updateProductById)
  .delete(deleteProductById)

export default router
