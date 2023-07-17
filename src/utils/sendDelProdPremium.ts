import { NODEMAILER_USER, transporter } from '../config'
import { logger } from './logger'

export async function sendDelProdPremium(
  email: string,
  nameProd: string
): Promise<void> {
  try {
    const info = await transporter.sendMail({
      from: NODEMAILER_USER as string,
      to: email,
      subject: 'Eliminación de su producto Premium',
      html: `<p>Hola, su producto "${nameProd}" en la aplicación Ecommerce, ha sido eliminado por usted o un Administrador.</p>`
    })

    logger.info(`Email enviado: ${info.messageId}`)
  } catch (error) {
    console.log(error)
    logger.warn(`Ocurrió un error al enviar el email ${email}`)
  }
}
