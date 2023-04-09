import cors from 'cors'
import express, { type Express } from 'express'
import { api, whitelist } from './config'
import { connectDb } from './dataBase/connectDb'
import routes from './routes/index.routes'

console.log(whitelist())

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (whitelist().includes(origin as string) || whitelist().includes('*')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
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
