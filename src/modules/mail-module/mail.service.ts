import nodemailer, { Transporter } from 'nodemailer';
import { generateNewPasswordMessage, generateVerificationEmailMessage } from './mail.helpers';

class MailService {
  transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: 'Collectory',
      to,
      subject,
      html,
    });
  }

  async sendVerificationEmail(to: string, token: string) {
    const subject = 'Email Verification';
    const verificationEmailUrl = `${process.env.API_URL}/api/activate/${token}`;
    const html = generateVerificationEmailMessage(verificationEmailUrl);
    await this.sendEmail(to, subject, html);
  }

  async sendNewPasswordEmail(to: string, token: string, newPassword: string) {
    const subject = 'Confirm password changing';
    const verificationEmailUrl = `${process.env.API_URL}/api/resetPassword/${token}`;
    const html = generateNewPasswordMessage(verificationEmailUrl, newPassword);
    await this.sendEmail(to, subject, html);
  }
}

export const MailServiceInstance = new MailService();
