import { type Request, type Response } from 'express'
import { responseCustomError } from '../../utils/CustomError'
import { generarProducts } from '../../utils/generateProducts'

export async function mockProducts(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const data = await generarProducts()
    res.status(200).json({
      status: 'success',
      payload: data
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}
