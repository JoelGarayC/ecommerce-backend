import bodyparser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { type Express } from 'express'
import passport from 'passport'
import { join } from 'path'
import { api, configCloudinary, configHandlebars, corsOptions } from './config'
import { connectDb } from './dataBase/connectDb'
import routes from './routes/index.routes'
import viewsRoutes from './routes/views.routes'
import initializePassport from './utils/passport.config'

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
    configCloudinary()
    configHandlebars(this.app)
    initializePassport()
    this.app.use(bodyparser.json())
    this.app.use(bodyparser.urlencoded({ extended: true }))
    this.app.use(cookieParser())
    this.app.use(cors(corsOptions))
    this.app.use(express.json())
    this.app.use(express.static(join(__dirname, '../public')))
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(passport.initialize())
  }

  private routes(): void {
    this.app.use(api.pathBase, routes)
    this.app.use('/', viewsRoutes)
  }
}

export default App
