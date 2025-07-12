import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.enum('role', ['consumer', 'vendor', 'admin']).defaultTo('consumer');
    table.boolean('email_verified').defaultTo(false);
    table.string('verification_token');
    table.string('reset_password_token');
    table.timestamp('reset_password_expires');
    table.timestamp('last_login');
    table.boolean('is_active').defaultTo(true);
    table.jsonb('preferences').defaultTo('{}');
    table.timestamps(true, true);
    
    // Indexes
    table.index(['email']);
    table.index(['role']);
    table.index(['is_active']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
} 