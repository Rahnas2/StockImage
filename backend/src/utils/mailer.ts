import transporter from "../config/nodemailer"
import { InternalServerError } from "./errors"

export class Mailer {

    async sendVerificationMail(email: string, url: string) {
        const mailOption = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Email',
            html: `<p>Please verify your email by clicking the following link: <a href="${url}">${url}</a></p>`,
        }

        try {
            await transporter.sendMail(mailOption)
        } catch (error) {
            throw new InternalServerError('Error sending Eamil')
        }
    }

    async sendOtp(email: string, otp: string) {
        const mailOption = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'OTP Verification - Stock Image Platform',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 10px;">
                    <h2>Hello,</h2>
                    <p>We received a request to reset your password or verify your email.</p>
                    <p>Please use the following OTP to proceed:</p>
                    <h1 style="color: #2e86de; letter-spacing: 4px;">${otp}</h1>
                    <p>This OTP is valid for <strong>10 minutes</strong>.</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <br/>
                    <p>Thanks,</p>
                    <p><strong>Stock Image Platform Team</strong></p>
                </div>
    `,
        }

        try {
            await transporter.sendMail(mailOption)
        } catch (error) {  
            throw new InternalServerError('Error sending Eamil')
        }
    }
}