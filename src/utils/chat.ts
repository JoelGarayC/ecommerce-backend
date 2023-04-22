import type http from 'http'
import { Server } from 'socket.io'
import MessageService from '../dao/mongo/services/message.service'

const message = new MessageService()

export const initChat = (server: http.Server): void => {
  const io = new Server(server)

  io.on('connection', async (socket) => {
    console.log(`Un nuevo cliente se ha conectado con el ID: ${socket.id}`)

    try {
      const msgs = await message.getMessages()
      io.emit('update-chat', msgs)
    } catch (err: any) {
      console.log(err.message)
      io.emit('chat', 'error')
    }

    socket.on('chat', async (data) => {
      try {
        const msg = {
          user: data.user,
          message: data.message
        }
        const res = await message.addMessage(msg)
        if (res.length > 0) {
          const updatedMsgs = await message.getMessages()
          io.emit('update-chat', updatedMsgs)
        } else {
          socket.emit('chat', 'error')
        }
      } catch (error) {
        console.error(error)
        socket.emit('chat', 'error')
      }
    })
  })
}
