import { NODEMAILER_USER, transporter } from '../config'
import { logger } from './logger'

export async function sendDeleteEmail(email: string): Promise<void> {
  try {
    const info = await transporter.sendMail({
      from: NODEMAILER_USER as string,
      to: email,
      subject: 'Eliminación de cuenta',
      html: '<p>Hola, su cuenta en la aplicación Ecommerce, ha sido eliminada por inactividad</p>'
    })

    logger.info(`Email enviado: ${info.messageId}`)
  } catch (error) {
    console.log(error)
    logger.warn(`Ocurrió un error al enviar el email ${email}`)
  }
}
