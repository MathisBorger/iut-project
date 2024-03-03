'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.alterTable('user', (table) => {

            // Ajouter les nouveaux champs
            table.string('userName');
            table.string('password').notNull();
            table.string('mail').notNull().unique();
        });
    },

    async down(knex) {

        await knex.schema.alterTable('user', (table) => {
            // Supprimer les nouveaux champs en cas de rollback
            table.dropColumn('userName');
            table.dropColumn('password');
            table.dropColumn('mail');
        });
    }
};
