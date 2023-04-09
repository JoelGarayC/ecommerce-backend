const { PORT = 8080, MONGODB_URI, NODE_ENV } = process.env

const version = '/v1'
const pathBase = `/api${version}`

export const api = {
  version,
  pathBase: `/api${version}`,
  url: `http://localhost:${PORT}${pathBase}`
}

export const developmentAllowedOrigins = ['*']
export const productionAllowedOrigins = [
  'https://ecommerce-backend-rho.vercel.app',
  'https://ecommerce-backend-33ja3purz-joelgarayc.vercel.app'
]

export { MONGODB_URI, NODE_ENV, PORT }
