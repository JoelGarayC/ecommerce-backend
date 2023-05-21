import { connect } from 'mongoose'
import { MONGODB_URI } from '../config'
import { logger } from '../utils/logger'

export const connectDb = async (): Promise<void> => {
  try {
    const res = await connect(MONGODB_URI as string)
    const nameHost: string = res.connection.host
    logger.info(`MongoDb Connected: ${nameHost}`)
  } catch (err) {
    logger.error(`Error connecting to MongoDb: ${err as string}`)
  }
}
