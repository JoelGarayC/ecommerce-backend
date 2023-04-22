import { type IMessage } from '../../../types/IMessage'
import { Message } from '../models/Message'

class MessageService {
  async getMessages(): Promise<IMessage[]> {
    const messages = await Message.find().lean()
    return messages
  }

  async addMessage({ user, message }: IMessage): Promise<string> {
    const newMessage = new Message({
      user,
      message
    })
    await newMessage.save()
    return 'Mensaje enviado'
  }
}

export default MessageService
