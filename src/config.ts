const { PORT = 8080, MONGODB_URI, NODE_ENV } = process.env

const version = '/v1'
const pathBase = `/api${version}`

export const api = {
  version,
  pathBase: `/api${version}`,
  url: `http://localhost:${PORT}${pathBase}`
}

const developmentAllowedOrigins = ['*']
const productionAllowedOrigins = [
  'https://ecommerce-backend-rho.vercel.app',
  'https://ecommerce-backend-git-main-joelgarayc.vercel.app'
]

export function whitelist(): string[] {
  let allowedOrigins: string[]
  if (process.env.NODE_ENV === 'production') {
    return (allowedOrigins = productionAllowedOrigins)
  }
  allowedOrigins = developmentAllowedOrigins
  return allowedOrigins
}

export { MONGODB_URI, NODE_ENV, PORT }
