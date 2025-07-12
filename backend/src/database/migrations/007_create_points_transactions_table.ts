import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('points_transactions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // Transaction details
    table.integer('points').notNullable(); // Can be positive (earned) or negative (spent)
    table.enum('transaction_type', [
      'purchase_earned',
      'value_alignment',
      'level_up',
      'streak_bonus',
      'referral',
      'challenge_completed',
      'gifted',
      'received_gift',
      'donated',
      'redeemed',
      'admin_adjustment'
    ]).notNullable();
    
    // Related entities
    table.uuid('order_id'); // If related to an order
    table.uuid('listing_id'); // If related to a specific listing
    table.uuid('challenge_id'); // If related to a challenge
    table.uuid('gifted_to_user_id'); // If gifting points
    table.uuid('gifted_from_user_id'); // If receiving gifted points
    
    // Value tracking
    table.jsonb('value_impacts').defaultTo('{}'); // Which values were affected
    table.string('value_level_ups').defaultTo('[]'); // Which values leveled up
    
    // Metadata
    table.text('description');
    table.jsonb('metadata').defaultTo('{}'); // Additional transaction data
    table.boolean('is_reversible').defaultTo(false);
    table.uuid('reversed_from_transaction_id'); // If this transaction reversed another
    
    // Balance tracking
    table.integer('balance_before').notNullable();
    table.integer('balance_after').notNullable();
    
    table.timestamps(true, true);
    
    // Indexes
    table.index(['user_id']);
    table.index(['transaction_type']);
    table.index(['order_id']);
    table.index(['created_at']);
    table.index(['gifted_to_user_id']);
    table.index(['gifted_from_user_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('points_transactions');
} 