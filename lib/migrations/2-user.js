'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.alterTable('user', (table) => {

            // Ajouter les nouveaux champs
            table.string('role').defaultTo('user');
        });
    },

    async down(knex) {

        await knex.schema.alterTable('user', (table) => {
            // Supprimer les nouveaux champs en cas de rollback
            table.dropColumn('role');
        });
    }
};
