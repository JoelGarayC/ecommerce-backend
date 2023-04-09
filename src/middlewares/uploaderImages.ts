import { type Request } from 'express'
import multer from 'multer'
import { baseSrc } from '../utils/basePath'

const storage = multer.diskStorage({
  destination: function (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, `${baseSrc}/public/images`)
  },
  filename: function (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    cb(null, file.originalname)
  }
})

export const uploader = multer({ storage })
