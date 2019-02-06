import * as nodemailer from "nodemailer";

class Mail {

    constructor(
        public to?: string,
        public subject?: string,
        public message?: string) { }


    async sendMail() {
        return new Promise((resolve, reject) => {
            let mailOptions = {
                from: "guive.jalili@epitech.eu",
                to: this.to,
                subject: this.subject,
                html: this.message
            };

            const transporter = nodemailer.createTransport({
                host: "smtp.office365.com",
                port: 587,
                secure: false,
                auth: {
                    user: "guive.jalili@epitech.eu",
                    pass: ";>D38z,D"
                },
                tls: { rejectUnauthorized: false }
            });

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    reject(error);
                } else {
                    resolve("E-mail send");
                }
            });
        })
    }


}

export default new Mail;