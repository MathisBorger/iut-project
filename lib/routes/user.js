'use strict';

const Joi = require('joi');

module.exports = [

/* Routes for user */
{
    method: 'post',
    path: '/user',
    options: {
        auth: false,
        tags: ['api'],
        validate: {
            payload: Joi.object({
                firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                userName: Joi.string().min(3).example('xenosky').description('Username of the user'),
                password: Joi.string().required().min(8).example('123456azerty').description('Password of the user'),
                mail: Joi.string().required().email().example('some.example@gmail.com').description('Mail of the user'),
            })
        }
    },
    handler: async (request, h) => {

        const { userService } = request.services();

        return await userService.create(request.payload);
    }
},
{
    method: 'get',
    path: '/users',
    options: {
        auth : {
            scope: [ 'user', 'admin' ]
        },
        tags: ['api']
    },
    handler: (request, h) => {

        const { userService } = request.services();

        return userService.list();
    }
},
{
    method: 'delete',
    path: '/user/{id}',
    options: {
        auth : {
            scope: [ 'admin' ]
        },
        tags: ['api'],
        validate: {
            params: Joi.object({
                id: Joi.number().integer().positive().required().example('1').description('Id of the user')
            })
        }
    },
    handler: (request, h) => {
    
        const { userService } = request.services();

        return userService.delete(request.params);
    }
},
{
    method: 'patch',
    path: '/user/{id}',
    options: {
        auth : {
            scope: [ 'admin' ]
        },
        tags: ['api'],
        validate: {
            params: Joi.object({
                id: Joi.number().integer().positive().required().example('1').description('Id of the user')
            }),
            payload: Joi.object({
                firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                userName: Joi.string().min(3).example('xenosky').description('Username of the user'),
                password: Joi.string().min(8).example('123456azerty').description('Password of the user'),
                mail: Joi.string().email().example('some.example@gmail.com').description('Mail of the user'),
                // role: Joi.string().valid('user', 'admin').example('user').description('Role of the user')
            })
        }
    },
    handler: (request, h) => {
    
        const { userService } = request.services();

        return userService.patch(request.params.id, request.payload);
    }
},

/* Routes for login */
{
    method: 'post',
    path: '/user/login',
    options: {
        auth: false,
        tags: ['api'],
        validate: {
            payload: Joi.object({
                password: Joi.string().min(8).example('your_password').description('Password of the user'),
                mail: Joi.string().email().example('some.example@gmail.com').description('Mail of the user')
            })
        }
    },
    handler: (request, h) => {
    
        const { userService } = request.services();

        return userService.post(request.payload);
    }
},

/* Routes for favorite movies */
{
    method: 'get',
    path: '/user/{id}/favorites-movies',
    options: {
        auth : {
            scope: [ 'user', 'admin' ]
        },
        tags: ['api'],
        validate: {
            params: Joi.object({
                id: Joi.number().integer().positive().required().example('1').description('Id of the user'),
            })
        }
    },
    handler: (request, h) => {

        const { userService } = request.services();

        return userService.listFavoriteMovies(request.params.id); // fonction à créer
    }
},
{
    method: 'post',
    path: '/user/{idUser}/favorites-movies/{idMovie}',
    options: {
        auth : {
            scope: [ 'user', 'admin' ]
        },
        tags: ['api'],
        validate: {
            params: Joi.object({
                idUser: Joi.number().integer().positive().required().example('1').description('Id of the user'),
                idMovie: Joi.number().integer().positive().required().example('1').description('Id of the movie')
            })
        }
    },
    handler: (request, h) => {
    
        const { userService } = request.services();

        return userService.addFavoriteMovie(request.params.idUser, request.params.idMovie); // fonction à créer
    }
},
{
    method: 'delete',
    path: '/user/{idUser}/favorites-movies/{idMovie}',
    options: {
        auth : {
            scope: [ 'user', 'admin' ]
        },
        tags: ['api'],
        validate: {
            params: Joi.object({
                idUser: Joi.number().integer().positive().required().example('1').description('Id of the user'),
                idMovie: Joi.number().integer().positive().required().example('1').description('Id of the movie')
            })
        }
    },
    handler: (request, h) => {
    
        const { userService } = request.services();

        return userService.deleteFavoriteMovie(request.params.idUser, request.params.idMovie); // fonction à créer
    }
}];
