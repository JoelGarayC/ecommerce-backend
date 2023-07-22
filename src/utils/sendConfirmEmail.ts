import { NODEMAILER_USER, transporter } from '../config'
import { logger } from './logger'

export async function sendConfirmEmail(
  email: string,
  ticketCode: string,
  ammount: any
): Promise<void> {
  try {
    const info = await transporter.sendMail({
      from: NODEMAILER_USER as string,
      to: email,
      subject: 'Confirmación de compra',
      html: `<p>Gracias por tu compra. Tu ticket es: ${ticketCode}<br>
                MONTO TOTAL: $ ${ammount as number}<br>
            </p>`
    })

    logger.info(`Email enviado: ${info.messageId}`)
  } catch (error) {
    logger.warn(
      `Ocurrió un error al enviar el email ${email}, código de ticket ${ticketCode}`
    )
  }
}
