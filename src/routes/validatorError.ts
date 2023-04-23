import { type NextFunction, type Request, type Response } from 'express'
import { validationResult } from 'express-validator'

export const validatorExpressError = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res
        .status(400)
        .json({ status: 'error', statusCode: 400, errors: errors.array() })
    } else {
      next()
    }
  } catch (err: any) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: err.message
    })
  }
}
