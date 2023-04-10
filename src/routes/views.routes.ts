import { Router, type Request, type Response } from 'express'

import {
  getProducts,
  getProductsById
} from '../dao/mongoDb/controllers/views.controller'
import { responseCustomError } from '../utils/CustomError'

const router = Router()

router.get('/', async function (_req: Request, res: Response): Promise<void> {
  try {
    res.redirect('/products')
  } catch (err) {
    responseCustomError(res, err)
  }
})

router.get('/products', getProducts)
router.get('/products/:pid', getProductsById)

export default router
