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

  async sendActivationMail(to: string, link: string) {
    await this.transporter.sendMail({
      from: 'Collectory',
      to,
      subject: 'Collectory account activation',
      text: 'Collectory account activation',
      html: `
                      <div>
                          <h1>Collectory</h1>
                          <h2>Email confirmation</h2>
                          <p>
                            Please follow the link below to confirm your email. 
                          </p>
                          <a href="${link}">${link}</a>
                      </div>
                  `,
    });
  }
}

export default new MailService();
