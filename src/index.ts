import 'dotenv/config'
import displayRoutes from 'express-routemap'
import http from 'http'
import App from './app'
import { PORT, configCloudinary, configHandlebars } from './config'
import { initChat } from './utils/chat'

const application = new App().app
const server = http.createServer(application)

// Configuraciones iniciales
configCloudinary()
configHandlebars(application)

// socketio
initChat(server)

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`)
  displayRoutes(application)
})
