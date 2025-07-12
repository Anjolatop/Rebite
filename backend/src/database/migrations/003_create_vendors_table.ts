import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('vendors', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.enum('vendor_type', ['farmer', 'restaurant']).notNullable();
    table.string('display_name').notNullable();
    table.text('bio');
    table.string('business_license');
    table.string('tax_id');
    
    // Contact information
    table.string('phone_number');
    table.string('website');
    table.string('email');
    
    // Location (PostGIS)
    table.point('location'); // PostGIS point for geolocation
    table.string('address').notNullable();
    table.string('city').notNullable();
    table.string('state').notNullable();
    table.string('zip_code').notNullable();
    table.string('country').defaultTo('US');
    
    // Business details
    table.jsonb('business_hours').defaultTo('{}');
    table.jsonb('payment_methods').defaultTo('[]');
    table.decimal('delivery_radius', 8, 2).defaultTo(10.0); // miles
    table.decimal('delivery_fee', 8, 2).defaultTo(0.0);
    table.integer('min_order_amount').defaultTo(0); // cents
    
    // Verification and status
    table.boolean('is_verified').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.timestamp('verified_at');
    table.string('verification_documents'); // JSON array of document URLs
    
    // Analytics
    table.integer('total_listings').defaultTo(0);
    table.integer('total_orders').defaultTo(0);
    table.decimal('average_rating', 3, 2).defaultTo(0.0);
    table.integer('total_reviews').defaultTo(0);
    
    // Social impact
    table.integer('food_rescued_lbs').defaultTo(0);
    table.integer('co2_saved_lbs').defaultTo(0);
    table.integer('meals_provided').defaultTo(0);
    
    table.timestamps(true, true);
    
    // Indexes
    table.index(['user_id']);
    table.index(['vendor_type']);
    table.index(['location']);
    table.index(['is_verified']);
    table.index(['is_active']);
    table.index(['city', 'state']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('vendors');
} 