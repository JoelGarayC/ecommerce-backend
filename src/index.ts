import 'dotenv/config'
import displayRoutes from 'express-routemap'
import App from './app'
import { PORT, configCloudinary, configHandlebars } from './config'

const application = new App().app

// Configuraciones iniciales
configCloudinary()
configHandlebars(application)

application.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`)
  displayRoutes(application)
})
