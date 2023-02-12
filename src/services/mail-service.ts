import nodemailer, { Transporter } from 'nodemailer';

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
    const html = `
    <div>
        <h1>Collectory</h1>
        <h2>Email confirmation</h2>
        <p>
            Dear user,  To verify your email, click on this link: <a href="${verificationEmailUrl}">${verificationEmailUrl}</a>
            If you did not create an account, then ignore this email.
        </p>
        
    </div>
    `;
    await this.sendEmail(to, subject, html);
  }
}

export default new MailService();
