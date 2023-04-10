import cors from 'cors'
import express, { type Express } from 'express'
import { api, corsOptions } from './config'
import { connectDb } from './dataBase/connectDb'
import routes from './routes/index.routes'
import viewsRoutes from './routes/views.routes'
import { baseUrl } from './utils/baseUrl'

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
    this.app.use(express.static(baseUrl + 'public'))
  }

  private routes(): void {
    this.app.use(api.pathBase, routes)
    this.app.use('/', viewsRoutes)
  }
}

export default App
