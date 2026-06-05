
import nodemailer from 'nodemailer';
import SMTPConnection from 'nodemailer/lib/smtp-connection';

const transporter = nodemailer.createTransport({
  host: process.env.BULK_EMAIL_HOST,
  port: process.env.BULK_EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.BULK_EMAIL_LOGIN,
    pass: process.env.BULK_EMAIL_PASSWORD,
  },
} as SMTPConnection.Options);



export const sendSingleEmail = async (message: string, subject: string, email: string) => {

  console.log({
  host: process.env.BULK_EMAIL_HOST,
  port: process.env.BULK_EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.BULK_EMAIL_LOGIN,
    pass: process.env.BULK_EMAIL_PASSWORD,
  },
})
  try {

    if (email) {
      await transporter.sendMail({
        from: process.env.BULK_EMAIL_USER,
        to: email,
        subject,
        text: message.replace(/<[^>]+>/g, ''),
        html: message,
      });

      console.log(`Email sent successfully to ${email}`);
    }

  } catch (error: any) {
    console.log(error)
    throw new Error(error?.message || "Error sending email");
  }
};