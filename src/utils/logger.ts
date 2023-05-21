import winston from 'winston'
import { NODE_ENV } from '../config'

interface CustomLevels {
  levels: Record<string, number>
}
const myCustomLevels: CustomLevels = {
  levels: {
    debug: 4,
    http: 3,
    info: 2,
    warn: 1,
    error: 0
  }
}

const developmentLogger = winston.createLogger({
  levels: myCustomLevels.levels,
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.combine(winston.format.simple())
      )
    }),
    new winston.transports.File({
      filename: 'logs/errors.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.combine(winston.format.simple())
      )
    })
  ]
})

const productionLogger = winston.createLogger({
  levels: myCustomLevels.levels,
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.combine(winston.format.simple())
      )
    }),
    new winston.transports.File({
      filename: 'logs/errors.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.combine(winston.format.simple())
      )
    })
  ]
})

export const logger =
  NODE_ENV === 'production' ? productionLogger : developmentLogger
