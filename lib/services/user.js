'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const Encrypt = require('iut-encrypt-mathis');
const Jwt = require('@hapi/jwt');

module.exports = class UserService extends Service {

        async create(user){

            const { User } = this.server.models();
            const { mailService } = this.server.services();
            
            user.password = Encrypt.sha1(user.password);
            const newUser = await User.query().insertAndFetch(user);
            
            // console.log(newUser.firstName + ' ' + newUser.lastName + ' ' + newUser.mail + ' ' + newUser.password);
            mailService.sendMail(
                {
                    from: 'Ethereal Joaquin <joaquin.crona37@ethereal.email>',
                    to: 'mathisborger24@gmail.com',
                    subject: 'Bonjour ' + newUser.firstName + ' ' + newUser.lastName + ' ✔',
                    text: 'Bienvenue dans l\'application qui répertorie tes films préférés et t\'averti des nouveaux films disponibles !. Tu peux dès à présent chercher des films et les ajouter à ta liste de films préférés',
                    // html: '<p><b>Hello</b> to myself!</p>',
                    html: '<p>Bienvenue dans l\'application qui répertorie tes films préférés et t\'averti des nouveaux films disponibles !. Tu peux dès à présent chercher des films et les ajouter à ta liste de films préférés</p>'
                }
            );

            return newUser;
        }

        list(){
                        
            const { User } = this.server.models();

            return User.query();
        }

        async delete(user){
                
            const { User } = this.server.models();

            if ( !(await User.query().findById(user.id)) ) return Promise.reject(new Error('L\'utilisateur n\'existe pas'));

            await User.query().delete().where('id', user.id);
            return Promise.resolve('');
        }

        patch(userId, user){

            const { User } = this.server.models();
            user.password = Encrypt.sha1(user.password);

            return User.query().patchAndFetchById(userId, user);
        }

        async post(user){

            const { User } = this.server.models();
            user.password = Encrypt.sha1(user.password);
            
            try {
                if (!user.mail || !user.password) {
                    return 'E-mail and password are required';
                }
                const realUser = await User.query().where('mail', user.mail).where('password', user.password).first().throwIfNotFound();
                const token = Jwt.token.generate(
                    {
                        aud: 'urn:audience:iut',
                        iss: 'urn:issuer:iut',
                        firstName: realUser.firstName,
                        lastName: realUser.lastName,
                        email: realUser.mail,
                        scope: realUser.role
                    },
                    {
                        key: 'random_string', // La clé qui est définit dans lib/auth/strategies/jwt.js
                        algorithm: 'HS512'
                    },
                    {
                        ttlSec: 14400 // 4 hours
                    }
                );

                return token;

            } catch (err) {

                // const error = new Error('Unauthorized');
                return Boom.unauthorized('Unauthorized');
                // return err.message;
            }
        }

        // Récupérer la liste des films favoris d'un utilisateur
        async listFavoriteMovies(userId) {
            try {
                const { User } = this.server.models();
                const user = await User.query().findById(userId).throwIfNotFound({
                    message: `The user does not exist`,
                    type: `User Not Found`
                }).withGraphFetched('favoriteMovies');
                if (!user || !user.favoriteMovies) {
                    return []; // Si l'utilisateur n'existe pas ou n'a pas de films favoris, retourne un tableau vide
                }
                
                console.log(user.favoriteMovies);
                const favoriteMovies = user.favoriteMovies.map(movie => movie.toJSON());
                console.log(favoriteMovies);
                return favoriteMovies;
            } catch (error) {

                return Boom.notFound(error.message);
            }
        }

        // Ajouter un film aux favoris de l'utilisateur
        async addFavoriteMovie(userId, movieId) {
            try {
                const { User, Movie } = this.server.models();

                // Vérifie que l'utilisateur existe
                const user = await User.query().findById(userId).throwIfNotFound({
                    message: `The user does not exist`,
                    type: `User Not Found`
                });
                // Vérifie que le film existe
                await Movie.query().findById(movieId).throwIfNotFound({
                    message: `The movie does not exist`,
                    type: `Movie Not Found`
                });
                // L'utilisateur et le film existe, donc on ajoute le film aux films favoris de l'utilisateur
                await user.$relatedQuery('favoriteMovies').relate(movieId);
                
                return await Movie.query().findById(movieId); // retourne le film ajouté aux films favoris de l'utilisateur
            } catch (error) {

                return Boom.notFound(error.message);
            }
        }

        // Supprimer un film des favoris de l'utilisateur
        async deleteFavoriteMovie(userId, movieId) {
            try {
                const { User, Movie } = this.server.models();
                
                // Vérifie que l'utilisateur existe
                const user = await User.query().findById(userId).throwIfNotFound({
                    message: `The user does not exist`,
                    type: `User Not Found`
                });
                // Vérifie que le film existe
                await user.$relatedQuery('favoriteMovies').findById(movieId).throwIfNotFound({
                    message: `The movie does not exist in the user's favorite movies`,
                    type: `Movie Not Found in User's Favorite Movies`
                });
                // L'utilisateur et le film existe, donc on supprime le film des films favoris de l'utilisateur
                await user.$relatedQuery('favoriteMovies').unrelate().where('id', movieId);

                return await Movie.query().findById(movieId); // retourne le film supprimé des films favoris de l'utilisateur
            } catch (error) {

                return Boom.notFound(error.message);
            }
        }

}
