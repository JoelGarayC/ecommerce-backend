import { NODEMAILER_USER, transporter } from '../config'

export async function sendConfirmEmail(
  email: string,
  ticketCode: string
): Promise<void> {
  try {
    const info = await transporter.sendMail({
      from: NODEMAILER_USER as string,
      to: email,
      subject: 'Confirmación de compra',
      html: `<p>Gracias por tu compra. Tu ticket es: ${ticketCode}</p>`
    })

    console.log(`Email enviado: ${info.messageId}`)
  } catch (error) {
    console.error(error)
  }
}
