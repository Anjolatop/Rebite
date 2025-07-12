-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'consumer' CHECK (role IN ('consumer', 'vendor', 'admin')),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User profiles table
CREATE TABLE profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    nutrition_goals JSONB DEFAULT '{}',
    allergies TEXT[] DEFAULT '{}',
    diet_preferences TEXT[] DEFAULT '{}',
    fitness_sync_source VARCHAR(20) DEFAULT 'none',
    value_bars JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendors table
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vendor_type VARCHAR(20) NOT NULL CHECK (vendor_type IN ('farmer', 'restaurant')),
    display_name VARCHAR(200) NOT NULL,
    bio TEXT,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(20),
    website VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Listings table
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    nutrition JSONB DEFAULT '{}',
    price_cents INTEGER NOT NULL,
    original_price_cents INTEGER,
    quantity_available INTEGER NOT NULL DEFAULT 1,
    quantity_sold INTEGER DEFAULT 0,
    expires_at TIMESTAMP NOT NULL,
    rescue_score INTEGER DEFAULT 0 CHECK (rescue_score >= 0 AND rescue_score <= 100),
    image_urls TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id),
    total_amount_cents INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method VARCHAR(20),
    delivery_address TEXT,
    delivery_instructions TEXT,
    estimated_delivery TIMESTAMP,
    actual_delivery TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id),
    quantity INTEGER NOT NULL,
    unit_price_cents INTEGER NOT NULL,
    total_price_cents INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Points transactions table
CREATE TABLE points_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id),
    points INTEGER NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('earned', 'spent', 'gifted', 'received', 'donated')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Value bar updates table
CREATE TABLE value_bar_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id),
    value_name VARCHAR(50) NOT NULL,
    old_level INTEGER NOT NULL,
    new_level INTEGER NOT NULL,
    old_progress DECIMAL(5,2) NOT NULL,
    new_progress DECIMAL(5,2) NOT NULL,
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recipes table
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    ingredients JSONB NOT NULL,
    instructions TEXT[] NOT NULL,
    nutrition JSONB DEFAULT '{}',
    prep_time_minutes INTEGER,
    cook_time_minutes INTEGER,
    servings INTEGER,
    difficulty VARCHAR(20),
    tags TEXT[] DEFAULT '{}',
    image_url VARCHAR(500),
    external_id VARCHAR(100),
    source VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recipe suggestions table
CREATE TABLE recipe_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    recipe_id UUID REFERENCES recipes(id),
    ingredients_available TEXT[] NOT NULL,
    ingredients_missing TEXT[] DEFAULT '{}',
    missing_ingredients_cost_cents INTEGER DEFAULT 0,
    confidence_score DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Challenges table
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    challenge_type VARCHAR(50) NOT NULL,
    requirements JSONB NOT NULL,
    reward_points INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User challenge progress table
CREATE TABLE user_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES challenges(id),
    progress JSONB DEFAULT '{}',
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badges table
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    category VARCHAR(50),
    requirements JSONB NOT NULL,
    points_reward INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User badges table
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_listings_vendor_id ON listings(vendor_id);
CREATE INDEX idx_listings_expires_at ON listings(expires_at);
CREATE INDEX idx_listings_is_active ON listings(is_active);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_points_transactions_user_id ON points_transactions(user_id);
CREATE INDEX idx_value_bar_updates_user_id ON value_bar_updates(user_id);

-- Create spatial index for vendor locations
CREATE INDEX idx_vendors_location ON vendors USING GIST (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_challenges_updated_at BEFORE UPDATE ON user_challenges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();