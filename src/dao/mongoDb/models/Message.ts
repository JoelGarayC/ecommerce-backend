import { Schema, model } from 'mongoose'
import { type IMessage } from '../../../types/IMessage'

const MessageSchema = new Schema<IMessage>({
  user: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
})

export const Message = model<IMessage>('Message', MessageSchema)
