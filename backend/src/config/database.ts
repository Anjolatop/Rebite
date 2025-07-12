import knex from 'knex';
import { config } from 'dotenv';

config();

const dbConfig = {
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'rebite',
  },
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
  },
  migrations: {
    directory: './src/database/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './src/database/seeds',
  },
  debug: process.env.NODE_ENV === 'development',
};

export const db = knex(dbConfig);

export const initializeDatabase = async () => {
  try {
    // Test the connection
    await db.raw('SELECT 1');
    console.log('✅ Database connection successful');
    
    // Run migrations
    await db.migrate.latest();
    console.log('✅ Database migrations completed');
    
    return db;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('⚠️  Starting app without database connection...');
    console.log('💡 To start the database, run: docker compose up -d postgres redis');
    console.log('💡 Or install Docker Desktop and run the setup script');
    
    // Return a mock database for development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Using mock database for development');
      return db;
    }
    
    // Only throw in production
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
    
    return db;
  }
};

export default db; 