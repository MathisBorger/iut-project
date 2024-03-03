'use strict';

const Joi = require('joi');

module.exports = [

/* Routes for movie */
{
    method: 'post',
    path: '/movie',
    options: {
        auth : {
            scope: [ 'admin' ]
        },
        tags: ['api'],
        validate: {
            payload: Joi.object({
                title: Joi.string().required().min(3).example('Titanic').description('Title of the movie'),
                description: Joi.string().example('New movie of this year').description('Description of the movie'),
                releaseDate: Joi.date().required().description('Date of release of the movie'),
                director: Joi.string().required().min(3).example('Theo').description('Name of the director'),
            })
        }
    },
    handler: async (request, h) => {

        const { movieService } = request.services();

        return await movieService.create(request.payload);
    }
},
{
    method: 'get',
    path: '/movies',
    options: {
        auth : {
            scope: [ 'user', 'admin' ]
        },
        tags: ['api']
    },
    handler: (request, h) => {

        const { movieService } = request.services();

        return movieService.list();
    }
},
{
    method: 'delete',
    path: '/movie/{id}',
    options: {
        auth : {
            scope: [ 'admin' ]
        },
        tags: ['api'],
        validate: {
            params: Joi.object({
                id: Joi.number().integer().positive().required().example('1').description('Id of the movie')
            })
        }
    },
    handler: (request, h) => {
    
        const { movieService } = request.services();

        return movieService.delete(request.params);
    }
},
{
    method: 'patch',
    path: '/movie/{id}',
    options: {
        auth : {
            scope: [ 'admin' ]
        },
        tags: ['api'],
        validate: {
            params: Joi.object({
                id: Joi.number().integer().positive().required().example('1').description('Id of the movie')
            }),
            payload: Joi.object({
                title: Joi.string().required().min(3).example('Titanic').description('Title of the movie'),
                description: Joi.string().example('New movie of this year').description('Description of the movie'),
                releaseDate: Joi.date().required().description('Username of the user'),
                director: Joi.string().required().min(3).example('Theo').description('Name of the director'),
            })
        }
    },
    handler: (request, h) => {
    
        const { movieService } = request.services();

        return movieService.patch(request.params.id, request.payload);
    }
}];
