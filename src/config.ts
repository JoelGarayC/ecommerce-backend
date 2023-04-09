import { type CorsOptions } from 'cors'

const { PORT = 8080, MONGODB_URI, NODE_ENV } = process.env
const version = '/v1'
const pathBase = `/api${version}`
const developmentAllowedOrigins = ['*']
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

export { MONGODB_URI, NODE_ENV, PORT }
