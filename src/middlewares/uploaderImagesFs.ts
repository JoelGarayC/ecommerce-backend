import { type Request } from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import { join } from 'path'
const { ObjectId } = mongoose.Types

const storage = multer.diskStorage({
  destination: function (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, join(__dirname, '../../public/images'))
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

const storageDocs = multer.diskStorage({
  destination: function (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    // validando uid
    const { uid } = _req.params
    if (!ObjectId.isValid(uid) || uid === undefined) {
      cb(new Error('Escriba un uid valido'), '')
    }

    // Determina la carpeta de destino en función del criterio

    let destinationFolder = ''
    if (_file.mimetype === 'image/jpeg' || _file.mimetype === 'image/png') {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (_file.originalname.match(/profile|perfil/i)) {
        destinationFolder = '/profiles'
      } else {
        destinationFolder = '/products'
      }
    } else if (_file.mimetype === 'application/pdf') {
      destinationFolder = '/documents'
    }

    const destinationPath = join(
      __dirname,
      '../../public/images',
      destinationFolder
    )

    cb(null, destinationPath)
  },
  filename: function (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    const { uid } = _req.params
    // Genera un nombre de archivo único basado en algún criterio (por ejemplo, la fecha actual)
    const uniqueFilename = `${uid}-${file.originalname}`
    cb(null, uniqueFilename)
  }
})

export const uploaderDocs = multer({ storage: storageDocs })
