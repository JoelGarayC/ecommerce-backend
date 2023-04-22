import { Router, type Request, type Response } from 'express'
import carts from './carts.routes'
import products from './products.routes'
import sessions from './sessions.routes'
import users from './users.routes'

const router = Router()

router.use('/products', products)
router.use('/carts', carts)
router.use('/sessions', sessions)
router.use('/users', users)

router.get('/', async (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to the API'
  })
})

export default router
