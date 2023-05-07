import { Schema, model } from 'mongoose'
import { type ITicket } from '../../../types/ITicket'

const TicketSchema = new Schema<ITicket>({
  code: {
    type: String,
    required: true
  },
  purchase_datetime: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    default: 0
  },
  purchaser: {
    type: String,
    required: true
  }
})

export const Ticket = model<ITicket>('Ticket', TicketSchema)
