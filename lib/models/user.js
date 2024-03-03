'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class User extends Model {

    static get tableName() {

        return 'user';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
            lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
            userName: Joi.string().min(3).example('xenosky').description('Username of the user'),
            password: Joi.string().min(8).example('123456azerty').description('Password of the user'),
            mail: Joi.string().email().example('some.example@gmail.com').description('Mail of the user'),
            // role: Joi.string().valid('admin', 'user').default('user').description('Role of the user'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {

        this.role = 'user';
        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();
    }

    static get relationMappings() {
        return {
            favoriteMovies: {
                relation: Model.ManyToManyRelation,
                modelClass: () => require('./movie'), // Movie
                join: {
                    from: 'user.id',
                    through: {
                        from: 'user_movie.user_id',
                        to: 'user_movie.movie_id'
                    },
                    to: 'movie.id'
                }
            }
        };
    }

};
