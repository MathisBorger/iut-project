'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.createTable('user_movie', (table) => {
            table.integer('user_id').unsigned().references('id').inTable('user');
            table.integer('movie_id').unsigned().references('id').inTable('movie');
        });
    },

    async down(knex) {

        await knex.schema.dropTableIfExists('user_movie');
    }
};
