import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('orders', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('vendor_id').references('id').inTable('vendors').onDelete('CASCADE');
    
    // Order details
    table.string('order_number').unique().notNullable();
    table.enum('status', ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled', 'refunded']).defaultTo('pending');
    table.enum('order_type', ['pickup', 'delivery']).notNullable();
    
    // Pricing
    table.integer('subtotal_cents').notNullable();
    table.integer('delivery_fee_cents').defaultTo(0);
    table.integer('tax_cents').defaultTo(0);
    table.integer('discount_cents').defaultTo(0);
    table.integer('total_cents').notNullable();
    table.integer('points_used').defaultTo(0);
    table.integer('points_earned').defaultTo(0);
    
    // Payment
    table.enum('payment_method', ['card', 'ebt', 'points', 'mixed']).notNullable();
    table.string('payment_intent_id'); // Stripe payment intent ID
    table.enum('payment_status', ['pending', 'paid', 'failed', 'refunded']).defaultTo('pending');
    table.timestamp('paid_at');
    
    // Delivery information
    table.string('delivery_address');
    table.string('delivery_city');
    table.string('delivery_state');
    table.string('delivery_zip_code');
    table.point('delivery_location'); // PostGIS point
    table.string('delivery_instructions');
    table.timestamp('estimated_delivery_time');
    table.timestamp('actual_delivery_time');
    
    // Driver information
    table.uuid('driver_id'); // References users table for delivery drivers
    table.string('driver_name');
    table.string('driver_phone');
    table.string('driver_vehicle_info');
    
    // Customer information
    table.string('customer_name');
    table.string('customer_phone');
    table.string('customer_email');
    
    // Order tracking
    table.timestamp('confirmed_at');
    table.timestamp('preparing_at');
    table.timestamp('ready_at');
    table.timestamp('out_for_delivery_at');
    table.timestamp('delivered_at');
    table.timestamp('cancelled_at');
    
    // Cancellation
    table.string('cancellation_reason');
    table.string('cancelled_by'); // user_id or 'system'
    
    // Analytics and impact
    table.integer('food_rescued_lbs').defaultTo(0);
    table.integer('co2_saved_lbs').defaultTo(0);
    table.jsonb('value_impacts').defaultTo('{}'); // Impact on user's value bars
    
    // Notes and communication
    table.text('customer_notes');
    table.text('vendor_notes');
    table.text('driver_notes');
    
    table.timestamps(true, true);
    
    // Indexes
    table.index(['user_id']);
    table.index(['vendor_id']);
    table.index(['order_number']);
    table.index(['status']);
    table.index(['payment_status']);
    table.index(['created_at']);
    table.index(['estimated_delivery_time']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('orders');
} 