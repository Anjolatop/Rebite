import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('profiles', (table) => {
    table.uuid('user_id').primary().references('id').inTable('users').onDelete('CASCADE');
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('phone_number');
    table.date('date_of_birth');
    table.enum('gender', ['male', 'female', 'other', 'prefer_not_to_say']);
    
    // Nutrition and health data
    table.jsonb('nutrition_goals').defaultTo('{}'); // e.g. {"goal":"weight_loss","target":50}
    table.text('allergies').defaultTo('[]'); // Array of allergies
    table.text('diet_preferences').defaultTo('[]'); // vegan, keto, etc.
    table.enum('fitness_sync_source', ['fitbit', 'apple', 'google', 'none']).defaultTo('none');
    table.string('fitness_sync_token');
    
    // Value-based tracking
    table.jsonb('value_bars').defaultTo('{}'); // {"Discipline":{"level":2,"progress":64}, ...}
    table.jsonb('selected_goals').defaultTo('[]'); // Array of user-selected goals
    table.integer('total_points').defaultTo(0);
    table.integer('streak_days').defaultTo(0);
    table.timestamp('last_activity');
    
    // Location and preferences
    table.point('location'); // PostGIS point for geolocation
    table.string('address');
    table.string('city');
    table.string('state');
    table.string('zip_code');
    table.string('country').defaultTo('US');
    
    // Notification preferences
    table.boolean('email_notifications').defaultTo(true);
    table.boolean('sms_notifications').defaultTo(false);
    table.boolean('push_notifications').defaultTo(true);
    
    table.timestamps(true, true);
    
    // Indexes
    table.index(['location']);
    table.index(['total_points']);
    table.index(['streak_days']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('profiles');
} 