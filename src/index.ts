import cloudinary from 'cloudinary'
import 'dotenv/config'
import displayRoutes from 'express-routemap'
import App from './app'
import {
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
  CLOUD_NAME,
  PORT,
  configHandlebars
} from './config'

const application = new App().app

cloudinary.v2.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET
})

// Configuracion de Handlebars como motor de plantillas
configHandlebars(application)

application.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`)
  displayRoutes(application)
})
