const { PORT = 8080, MONGODB_URI } = process.env

const version = '/v1'
const pathBase = `/api${version}`

export const api = {
  version,
  pathBase: `/api${version}`,
  url: `http://localhost:${PORT}${pathBase}`
}

export { MONGODB_URI, PORT }
