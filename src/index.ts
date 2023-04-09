import 'dotenv/config'
import displayRoutes from 'express-routemap'
import App from './app'
import { PORT } from './config'

const application = new App().app

application.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`)
  displayRoutes(application)
})
