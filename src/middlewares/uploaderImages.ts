import { type Request } from 'express'
import multer from 'multer'
import { baseUrl } from '../utils/baseUrl'

const storage = multer.diskStorage({
  destination: function (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, `${baseUrl}/public/images`)
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
