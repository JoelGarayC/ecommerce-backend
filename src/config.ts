import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'
import { type CorsOptions } from 'cors'
import { type Express } from 'express'
import { create } from 'express-handlebars'
import handlebars from 'handlebars'
import { join } from 'path'

const { PORT = 8080, MONGODB_URI, NODE_ENV } = process.env
const version = '/v1'
const pathBase = `/api${version}`
const developmentAllowedOrigins = ['http://localhost:8000']
const productionAllowedOrigins = [
  'https://ecommerce-backend-rho.vercel.app',
  'https://ecommerce-backend-33ja3purz-joelgarayc.vercel.app'
]

export const api = {
  version,
  pathBase: `/api${version}`,
  url: `http://localhost:${PORT}${pathBase}`
}

function whitheList(): string[] {
  let allowedOrigins: string[]
  if (NODE_ENV === 'production') {
    allowedOrigins = productionAllowedOrigins
    return allowedOrigins
  } else {
    allowedOrigins = developmentAllowedOrigins
    return allowedOrigins
  }
}

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (origin === undefined) {
      callback(null, true)
      return
    }
    if (whitheList().includes(origin)) {
      callback(null, true)
      return
    }
    const msg =
      'The CORS policy for this site does not allow access from the specified Origin.'
    callback(new Error(msg), false)
  }
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

export { MONGODB_URI, NODE_ENV, PORT }
