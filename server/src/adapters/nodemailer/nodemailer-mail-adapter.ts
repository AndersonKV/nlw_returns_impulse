import nodemailer from 'nodemailer';
import { MailAdapter, SendMailData } from '../mail-adapter';
import dotenv from 'dotenv';

dotenv.config();

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
});

export class NodemailerMailAdapter implements MailAdapter {
    async sendMail({ subject, body }: SendMailData) {

        await transport.sendMail({
            from: 'Equipe Feedget <oi@feedget.com>',
            to: 'etc etc etc <cecil.uno@gmail.com>',
            subject,
            html: body,
        })
    };
}