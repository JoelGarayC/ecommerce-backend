import 'dotenv/config'
import displayRoutes from 'express-routemap'
import App from './app'
import { PORT, configHandlebars } from './config'

const application = new App().app

// Configuracion de Handlebars como motor de plantillas
configHandlebars(application)

application.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`)
  displayRoutes(application)
})
