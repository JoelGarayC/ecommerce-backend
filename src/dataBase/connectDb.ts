import { connect } from 'mongoose'
import { MONGODB_URI } from '../config'

export const connectDb = async (): Promise<void> => {
  try {
    const res = await connect(MONGODB_URI as string)
    const nameHost: string = res.connection.host
    console.log(`MongoDb Connected: ${nameHost}`)
  } catch (err) {
    console.log(`Error connecting to MongoDb: ${err as string}`)
  }
}
