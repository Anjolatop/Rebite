import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('listings', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('vendor_id').references('id').inTable('vendors').onDelete('CASCADE');
    table.string('title').notNullable();
    table.text('description');
    
    // Food categorization
    table.string('category').notNullable(); // produce, dairy, bakery, prepared_meals, etc.
    table.text('tags').defaultTo('[]'); // organic, local, gluten-free, etc.
    table.enum('food_type', ['produce', 'dairy', 'bakery', 'prepared_meals', 'pantry', 'frozen', 'beverages']).notNullable();
    
    // Pricing and inventory
    table.integer('price_cents').notNullable(); // Store in cents to avoid floating point issues
    table.integer('original_price_cents');
    table.integer('quantity_available').notNullable();
    table.string('unit').notNullable(); // lbs, pieces, servings, etc.
    table.integer('min_order_quantity').defaultTo(1);
    table.integer('max_order_quantity');
    
    // Quality and expiration
    table.timestamp('expires_at').notNullable();
    table.enum('quality_grade', ['perfect', 'good', 'imperfect', 'near_expiry']).defaultTo('good');
    table.integer('rescue_score').defaultTo(50); // 0-100, calculated by AI
    table.text('imperfection_details'); // Description of any imperfections
    
    // Nutrition information (JSONB for flexibility)
    table.jsonb('nutrition').defaultTo('{}'); // calories, protein, carbs, fat, fiber, etc.
    table.jsonb('ingredients').defaultTo('[]');
    table.boolean('is_organic').defaultTo(false);
    table.boolean('is_local').defaultTo(false);
    table.boolean('is_gluten_free').defaultTo(false);
    table.boolean('is_vegan').defaultTo(false);
    table.boolean('is_dairy_free').defaultTo(false);
    table.boolean('is_nut_free').defaultTo(false);
    
    // Images and media
    table.text('images').defaultTo('[]'); // Array of image URLs
    table.string('primary_image');
    
    // AI and recommendation data
    table.jsonb('ai_recommendations').defaultTo('{}'); // AI-generated tags and suggestions
    table.jsonb('value_alignment').defaultTo('{}'); // How this item aligns with user values
    table.decimal('sustainability_score', 3, 2).defaultTo(0.0); // 0-1 score
    
    // Status and visibility
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_featured').defaultTo(false);
    table.timestamp('featured_until');
    table.integer('view_count').defaultTo(0);
    table.integer('favorite_count').defaultTo(0);
    
    // Analytics
    table.integer('total_orders').defaultTo(0);
    table.integer('total_quantity_sold').defaultTo(0);
    table.decimal('average_rating', 3, 2).defaultTo(0.0);
    table.integer('total_reviews').defaultTo(0);
    
    table.timestamps(true, true);
    
    // Indexes
    table.index(['vendor_id']);
    table.index(['category']);
    table.index(['food_type']);
    table.index(['expires_at']);
    table.index(['rescue_score']);
    table.index(['is_active']);
    table.index(['is_featured']);
    table.index(['price_cents']);
    table.index(['quality_grade']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('listings');
} 