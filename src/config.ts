import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'
import cloudinary from 'cloudinary'
import { type CorsOptions } from 'cors'
import { type Express } from 'express'
import { create } from 'express-handlebars'
import handlebars from 'handlebars'
import { createTransport } from 'nodemailer'
import { join } from 'path'
import swaggerJSDoc from 'swagger-jsdoc'

const {
  PORT = 8080,
  MONGODB_URI,
  NODE_ENV,
  CLOUD_NAME,
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
  JWT_SECRET,
  URL_FRONTEND,
  URL_BACKEND,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  NODEMAILER_USER,
  NODEMAILER_PASS
} = process.env

const version = '/v1'
const pathBase = `/api${version}`
export const urlBase =
  (NODE_ENV as string) === 'production'
    ? (URL_BACKEND as string)
    : `http://localhost:${PORT}`

export const api = {
  version,
  pathBase,
  urlBase: `${urlBase}`,
  url: `${urlBase}${pathBase}`
}

let allowedOrigins: string[] = []
if (NODE_ENV === 'production') {
  allowedOrigins = [urlBase, api.urlBase, URL_FRONTEND as string]
} else {
  allowedOrigins = [
    urlBase,
    api.urlBase,
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ]
}

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (origin === undefined) {
      callback(null, true)
      return
    }
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }
    const msg =
      'The CORS policy for this site does not allow access from the specified Origin.'
    callback(new Error(msg), false)
  },
  credentials: true
}

export function configHandlebars(app: Express): void {
  const hbs = create({
    extname: '.hbs',
    defaultLayout: 'index',
    handlebars: allowInsecurePrototypeAccess(handlebars),
    layoutsDir: join(__dirname, '/views/layouts'),
    partialsDir: join(__dirname, '/views/partials')
  })

  app.engine('hbs', hbs.engine)
  app.set('view engine', 'hbs')
  app.set('views', join(__dirname, 'views'))
}

export function configCloudinary(): void {
  cloudinary.v2.config({
    cloud_name: CLOUD_NAME as string,
    api_key: CLOUD_API_KEY as string,
    api_secret: CLOUD_API_SECRET as string
  })
}

export const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: NODEMAILER_USER as string,
    pass: NODEMAILER_PASS as string
  }
})

export const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentación con swagger Ecommerce',
      description: 'API de ecommerce',
      version: '1.0.0'
    }
  },
  apis: [join(__dirname, './docs/**/*.yml')]
}

export const swaggerSpec = swaggerJSDoc(swaggerOptions)

export {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  JWT_SECRET,
  MONGODB_URI,
  NODEMAILER_PASS,
  NODEMAILER_USER,
  NODE_ENV,
  PORT
}
