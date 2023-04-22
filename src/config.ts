import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'
import cloudinary from 'cloudinary'
import { type CorsOptions } from 'cors'
import { type Express } from 'express'
import { create } from 'express-handlebars'
import handlebars from 'handlebars'
import { join } from 'path'

const {
  PORT = 8080,
  MONGODB_URI,
  NODE_ENV,
  CLOUD_NAME,
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
  JWT_SECRET,
  PERSISTENCE,
  URL_FRONTEND,
  URL_BACKEND
} = process.env

const version = '/v1'
const pathBase = `/api${version}`
export const urlBase =
  (NODE_ENV as string) === 'production'
    ? (URL_BACKEND as string)
    : 'http://localhost'

export const api = {
  version,
  pathBase,
  urlBase: `${urlBase}:${PORT}`,
  url: `${urlBase}:${PORT}${pathBase}`
}

let allowedOrigins: string[] = []
if (NODE_ENV === 'production') {
  allowedOrigins = [urlBase, api.urlBase, URL_FRONTEND as string]
} else {
  allowedOrigins = [urlBase, api.urlBase]
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

export { JWT_SECRET, MONGODB_URI, NODE_ENV, PERSISTENCE, PORT }
