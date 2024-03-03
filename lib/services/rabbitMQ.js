// rabbitmqService.js

const amqp = require('amqplib/callback_api');
const nodemailer = require('nodemailer');
const { Service } = require('@hapipal/schmervice');

module.exports = class RabbitMQService extends Service {
    constructor() {
        super();
        this.connection = null;
        this.channel = null;
        this.queue = 'mailsQueue';
    }

    async connect() {
        try {
            this.connection = await amqp.connect('amqp://localhost', (error, connection) => {

                if (error) {
                    throw error;
                }

                connection.createChannel((error1, channel) => {

                    if (error1) {
                        throw error1;
                    }
            
                    // const queue = 'hello';
                    // const msg = 'Hello World!';
            
                    // channel.assertQueue(queue, {
                    //     durable: false
                    // });
                    channel.assertQueue(this.queue, { durable: true });
            
                    channel.sendToQueue(queue, Buffer.from(msg));
                    console.log(' [x] Send %s', msg);
                });
            
                setTimeout(() => {
            
                    connection.close();
                    process.exit(0);
                }, 500);
            });

            // this.channel = await this.connection.createChannel((error, channel) => {

            //     if (error) {
            //         throw error;
            //     }

            //     return channel;
            // });

            // await this.channel.assertQueue(this.queue, { durable: true });
        } catch (error) {
            console.error('Une erreur est survenue lors de la connexion à RabbitMQ :', error);
            throw error;
        }
    }

    async sendMessage(message) {
        try {
            await this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(message)), { persistent: true });
        } catch (error) {
            console.error('Une erreur est survenue lors de l\'envoi du message à RabbitMQ :', error);
            throw error;
        }
    }

    // async consumeMessages() {
    //     try {
    //         console.log('Attente de messages...');

    //         this.channel.consume(this.queue, async (message) => {
    //             const mailInfo = JSON.parse(message.content.toString());

    //             const transporter = nodemailer.createTransport({
    //                 // Configuration de votre transporteur de messagerie
    //             });

    //             await transporter.sendMail(mailInfo);
    //             console.log('Message envoyé :', mailInfo);
    //             this.channel.ack(message);
    //         }, { noAck: false });
    //     } catch (error) {
    //         console.error('Une erreur est survenue lors de la consommation des messages :', error);
    //         throw error;
    //     }
    // }

    async consumeMessages() {
        try {
            console.log('Attente de messages...');
            
            const { mailService } = this.server.services();

            this.channel.consume('mailsQueue', async (message) => {
                const mailInfo = JSON.parse(message.content.toString());

                // Envoi du message à l'aide du service de mail existant
                await mailService.sendMail(mailInfo);

                console.log('Message envoyé :', mailInfo);
                this.channel.ack(message);
            }, { noAck: false });
        } catch (error) {
            console.error('Une erreur est survenue lors de la consommation des messages :', error);
            throw error;
        }
    }

    async close() {
        await this.connection.close();
    }
}
