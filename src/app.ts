import cors from 'cors'
import express, { type Express } from 'express'
import { api, whitelist } from './config'
import { connectDb } from './dataBase/connectDb'
import routes from './routes/index.routes'

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (origin === undefined) {
      callback(null, true)
      return
    }
    if (!whitelist().includes(origin)) {
      const msg =
        'The CORS policy for this site does not allow access from the specified Origin.'
      callback(new Error(msg), false)
      return
    }

    callback(null, true)
  }
}
class App {
  public app: Express

  constructor() {
    this.app = express()
    this.connectDataBase()
    this.middlewares()
    this.routes()
  }

  private connectDataBase(): void {
    void connectDb()
  }

  private middlewares(): void {
    this.app.use(cors(corsOptions))
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.static('public'))
  }

  private routes(): void {
    this.app.use(api.pathBase, routes)
  }
}

export default App
