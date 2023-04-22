import { type Response } from 'express'

export class CustomError extends Error {
  statusCode: number = 500

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

export function responseCustomError(res: Response, err: any): void {
  console.log(err.message)
  res.status(err.statusCode ?? 500).json({
    status: 'error',
    statusCode: err.statusCode ?? 500,
    message:
      err.message === undefined || err.statusCode === undefined
        ? 'Error en el servidor'
        : err.message
  })
}
