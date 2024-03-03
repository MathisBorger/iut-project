'use strict';

const Amqp = require('amqplib/callback_api');
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

        async sendMail(){
            try {

                const transporter = this.init();
                console.log('Credentials obtained, sending message...');

                Amqp.connect('amqp://localhost', (error0, connection) => {

                    if (error0) {
                        throw error0;
                    }

                    connection.createChannel((error1, channel) => {

                        if (error1) {
                            throw error1;
                        }

                        const queue = 'mailsQueue';

                        channel.assertQueue(queue, { durable: true });

                        console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);
                        channel.consume(queue, (msg) => {

                            console.log(' [x] Received %s', JSON.parse(msg.content.toString()));
                            transporter.sendMail(JSON.parse(msg.content.toString()));
                        }, {
                            noAck: true
                        });
                    });

                    setTimeout(() => {

                        connection.close();
                    }, 500);
                });
            }catch (err) {
                console.error('Error occurred:', err.message);
            }
        }
}
