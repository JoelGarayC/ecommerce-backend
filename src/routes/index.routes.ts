import { Router, type Request, type Response } from 'express'
import carts from './carts.routes'
import products from './products.routes'

const router = Router()

router.use('/products', products)
router.use('/carts', carts)

router.use('/', async (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to the API'
  })
})

export default router
