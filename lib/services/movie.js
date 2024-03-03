'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');

module.exports = class MovieService extends Service {

        async create(user){

            const { Movie } = this.server.models();
            const { mailService } = this.server.services();
            
            const newMovie = await Movie.query().insertAndFetch(user);
            
            mailService.sendMail(
                {
                    from: 'Ethereal Joaquin <joaquin.crona37@ethereal.email>',
                    to: 'mathisborger24@gmail.com',
                    subject: 'Un nouveau film est disponible ! -- ' + newMovie.title + ' ✔',
                    text: 'Le film ' + newMovie.title + ' est désormais disponible sur l\'application !',
                    html: '<p>Le film <b>' + newMovie.title + '</b> est désormais disponible sur l\'application !</p>'
                }
            );

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

        patch(movieId, movie){

            const { Movie } = this.server.models();

            return Movie.query().patchAndFetchById(movieId, movie);
        }
}
