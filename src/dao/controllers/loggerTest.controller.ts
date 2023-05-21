import { type Request, type Response } from 'express'
import { responseCustomError } from '../../utils/CustomError'
import { logger } from '../../utils/logger'

export async function loggerTest(_req: Request, res: Response): Promise<void> {
  try {
    logger.debug('Esto es un mensaje de depuración')
    logger.info('Esto es un mensaje informativo')
    logger.http('Esto es un mensaje de http')
    logger.warn('Esto es un mensaje de advertencia')
    logger.error('Esto es un mensaje de error')

    res.status(200).json({
      status: 'success'
    })
  } catch (err) {
    responseCustomError(res, err)
  }
}
