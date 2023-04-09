import express, { type Express } from 'express'
import { api } from './config'
import { connectDb } from './dataBase/connectDb'
import routes from './routes/index.routes'

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
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.static('public'))
  }

  private routes(): void {
    this.app.use(api.pathBase, routes)
  }
}

export default App
