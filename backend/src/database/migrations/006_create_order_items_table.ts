import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('order_items', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('order_id').references('id').inTable('orders').onDelete('CASCADE');
    table.uuid('listing_id').references('id').inTable('listings').onDelete('CASCADE');
    
    // Item details
    table.string('title').notNullable();
    table.text('description');
    table.integer('quantity').notNullable();
    table.string('unit').notNullable();
    
    // Pricing
    table.integer('unit_price_cents').notNullable();
    table.integer('total_price_cents').notNullable();
    table.integer('discount_cents').defaultTo(0);
    
    // Nutrition and dietary info
    table.jsonb('nutrition').defaultTo('{}');
    table.boolean('is_organic').defaultTo(false);
    table.boolean('is_local').defaultTo(false);
    table.boolean('is_gluten_free').defaultTo(false);
    table.boolean('is_vegan').defaultTo(false);
    table.boolean('is_dairy_free').defaultTo(false);
    table.boolean('is_nut_free').defaultTo(false);
    
    // Quality and rescue info
    table.enum('quality_grade', ['perfect', 'good', 'imperfect', 'near_expiry']).defaultTo('good');
    table.integer('rescue_score').defaultTo(50);
    table.text('imperfection_details');
    
    // Impact tracking
    table.integer('food_rescued_lbs').defaultTo(0);
    table.integer('co2_saved_lbs').defaultTo(0);
    table.jsonb('value_impacts').defaultTo('{}'); // Individual item impact on values
    
    // Vendor info (cached for performance)
    table.uuid('vendor_id');
    table.string('vendor_name');
    
    table.timestamps(true, true);
    
    // Indexes
    table.index(['order_id']);
    table.index(['listing_id']);
    table.index(['vendor_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('order_items');
} 