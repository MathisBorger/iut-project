'use strict';

const Amqp = require('amqplib/callback_api');
const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');
const jwt = require('jwt-simple');
// const jwt = require('@hapi/jwt');

module.exports = class MovieService extends Service {

        async create(user){

            const { Movie, User } = this.server.models();
            const { mailService, rabbitMQService } = this.server.services();
            
            const newMovie = await Movie.query().insertAndFetch(user);
                
            Amqp.connect('amqp://localhost', (error0, connection) => {

                if (error0) {
                    throw error0;
                }

                connection.createChannel(async (error1, channel) => {

                    if (error1) {
                        throw error1;
                    }

                    const queue = 'mailsQueue';

                    channel.assertQueue(queue, {
                        durable: true
                    });

                    for (const user of await User.query()) {

                        const message = {
                            from: 'Ethereal Joaquin <joaquin.crona37@ethereal.email>',
                            to: user.mail,
                            subject: 'Un nouveau film est disponible ! -- ' + newMovie.title + ' ✔',
                            text: 'Le film ' + newMovie.title + ' est désormais disponible sur l\'application !',
                            html: '<p>Le film <b>' + newMovie.title + '</b> est désormais disponible sur l\'application !</p>'
                        };

                        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
                        
                    }

                    console.log(' [x] Send tous les messages sont envoyés ');
                    
                });

                setTimeout(() => {

                    connection.close();
                }, 500);
            });
            
            mailService.sendMail();
            return newMovie;
        }

        list(){

            const { Movie } = this.server.models();

            return Movie.query();
        }

        async delete(movie){
                
            const { Movie } = this.server.models();

            if ( !(await Movie.query().findById(movie.id)) ) return Promise.reject(new Error('Le film n\'existe pas'));

            await Movie.query().delete().where('id', movie.id);
            return Promise.resolve('');
        }

        async patch(movieId, movie){

            try {

                const { Movie, User } = this.server.models();
                const { mailService } = this.server.services();

                // Vérifie que le film existe
                await Movie.query().findById(movieId).throwIfNotFound({
                    message: `The movie does not exist`,
                    type: `Movie Not Found`
                });

                // Met à jour le film
                const updatedMovie = await Movie.query().patchAndFetchById(movieId, movie);
                
                const usersWithFavoriteMovie = await updatedMovie.$relatedQuery('users');

                if (usersWithFavoriteMovie.length > 0) {

                    Amqp.connect('amqp://localhost', (error0, connection) => {

                        if (error0) {
                            throw error0;
                        }

                        connection.createChannel(async (error1, channel) => {

                            if (error1) {
                                throw error1;
                            }

                            const queue = 'mailsQueue';

                            channel.assertQueue(queue, {
                                durable: true
                            });

                            for (const user of usersWithFavoriteMovie) {

                                const message = {
                                    from: 'Ethereal Joaquin <joaquin.crona37@ethereal.email>',
                                    to: user.mail,
                                    subject: 'Mise à jour de votre film favori ! -- ' + updatedMovie.title + ' ✔',
                                    text: 'Le film ' + updatedMovie.title + ' a été mis à jour sur l\'application !',
                                    html: '<p>Le film <b>' + updatedMovie.title + '</b> a été mis à jour sur l\'application !</p>'
                                };

                                channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
                                
                            }

                            console.log(' [x] tous les messages sont envoyés ');
                            
                        });

                        setTimeout(() => {

                            connection.close();
                        }, 500);
                    });
                    
                    mailService.sendMail();
                }

                return updatedMovie;
            } catch (error) {

                Boom.notFound(error.message);
            }
        }

        async exportCSV(req) {

            const { Movie } = this.server.models();
            const { mailService } = this.server.services();
            // Récupére les données des films
            const movieData = await Movie.query();

            // Définit les colonnes du fichier CSV
            const csvWriter = createObjectCsvWriter({
                path: './upload-files/movies.csv', // Chemin du fichier CSV
                header: [
                    { id: 'title', title: 'Title' },
                    { id: 'description', title: 'Description' },
                    { id: 'releaseDate', title: 'Release Date' },
                    { id: 'director', title: 'Director' }
                ]
            });

            // Écrit les données dans le fichier CSV
            await csvWriter.writeRecords(movieData);

            // Lit le contenu du fichier CSV
            const csvString = fs.readFileSync('./upload-files/movies.csv', 'utf8');
            
            // Récupérer le token JWT de l'en-tête Authorization
            const authHeader = req.headers.authorization;
            // Extrait le token JWT
            const token = authHeader.split(' ')[1];
            // Décoder le token JWT pour obtenir le payload
            const decodedToken = jwt.decode(token, 'random_string');
            // Récupérer l'email de l'administrateur à partir du token JWT
            const adminEmail = decodedToken.email;

            Amqp.connect('amqp://localhost', (error0, connection) => {

                if (error0) {
                    throw error0;
                }

                connection.createChannel(async (error1, channel) => {

                    if (error1) {
                        throw error1;
                    }

                    const queue = 'mailsQueue';

                    channel.assertQueue(queue, {
                        durable: true
                    });

                    const mail = {
                        from: 'Ethereal Joaquin <joaquin.crona37@ethereal.email>',
                        to: adminEmail,
                        subject: 'Export CSV des films',
                        text: 'Vous trouverez ci-joint le fichier CSV contenant tous les films.',
                        html: '<p>Vous trouverez ci-joint le fichier CSV contenant tous les films.</p>',
                        attachments: [
                            {
                                filename: 'movies.csv',
                                content: csvString
                            }
                        ]
                    };

                    channel.sendToQueue(queue, Buffer.from(JSON.stringify(mail)));

                    console.log(' [x] tous les mails sont envoyés ');
                    
                });

                setTimeout(() => {

                    connection.close();
                }, 500);
            });
            
            mailService.sendMail();
            return 'Export CSV envoyé avec succès';
        }
}
