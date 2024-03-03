'use strict';

const { Service } = require('@hapipal/schmervice');
const nodemailer = require("nodemailer");

module.exports = class mailService extends Service {

        init(){

            const transport = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                // host: 'smtp.gmail.com',
                port: 587,
                secure: false, // Use `true` for port 465, `false` for all other ports
                auth: {
                    user: "joaquin.crona37@ethereal.email",
                    pass: "1duXQd27BRVR4A8H4C",
                    // user: 'mathisborger24@gmail.com',
                    // pass: 'mathisben24'
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            return transport;
        }

        async sendMail(message){

            try {

                const transporter = this.init();
                console.log('Credentials obtained, sending message...');

                // Message object
                // let message = {
                //     from: 'Ethereal Joaquin <joaquin.crona37@ethereal.email>',
                //     // from: 'Mathis Borger <mathisborger24@gmail.com>',
                //     to: 'mathisborger24@gmail.com',
                //     subject: 'Bonjour ✔',
                //     text: 'Bienvenu dans l\'application qui répertorie tes films préférés et t\'averti des nouveaux films disponibles!',
                //     html: '<p><b>Hello</b> to myself!</p>'
                // };

                let info = transporter.sendMail(message); //, (err, info) => {
                    // if (err) {
                    //     console.log('Error occurred. ' + err.message);
                    //     return process.exit(1);
                    // }

                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                // });
            }catch (err) {
                console.error('Error occurred:', err.message);
            }
        }
}
