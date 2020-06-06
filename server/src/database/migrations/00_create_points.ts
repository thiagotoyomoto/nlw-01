import Knex from 'knex';

const TABLE_NAME = 'points';

export async function up(knex: Knex) {
    return knex.schema.createTable(TABLE_NAME, table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('phone').notNullable();
        table.decimal('latitude').notNullable();
        table.decimal('longitude').notNullable();
        table.string('city').notNullable();
        table.string('uf', 2).notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(TABLE_NAME);
}