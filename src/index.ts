import 'dotenv/config'
import displayRoutes from 'express-routemap'
import http from 'http'
import App from './app'
import { PORT, api } from './config'
import { initChat } from './utils/chat'

const application = new App().app
const server = http.createServer(application)

// socket-io
initChat(server)

server.listen(PORT, () => {
  console.log(`Server is listening on ${api.urlBase}`)
  displayRoutes(application)
})
