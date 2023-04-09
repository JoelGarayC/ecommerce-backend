const { PORT = 8080, MONGODB_URI, NODE_ENV } = process.env

const version = '/v1'
const pathBase = `/api${version}`

export const api = {
  version,
  pathBase: `/api${version}`,
  url: `http://localhost:${PORT}${pathBase}`
}

const developmentAllowedOrigins = ['*']
const productionAllowedOrigins = ['https://ecommerce-backend-rho.vercel.app']

export function whitelist(): any[] {
  let allowedOrigins: string[]
  if (process.env.NODE_ENV === 'production') {
    allowedOrigins = productionAllowedOrigins
    return allowedOrigins
  }
  allowedOrigins = developmentAllowedOrigins
  return allowedOrigins
}

export { MONGODB_URI, NODE_ENV, PORT }
