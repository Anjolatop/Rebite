import { createClient } from 'redis';
import { config } from 'dotenv';

config();

const redisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  password: process.env.REDIS_PASSWORD,
  retry_strategy: (options: any) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  },
};

export const redis = createClient(redisConfig);

export const initializeRedis = async () => {
  try {
    await redis.connect();
    console.log('✅ Redis connection successful');
    
    // Test the connection
    await redis.ping();
    console.log('✅ Redis ping successful');
    
    return redis;
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Continuing without Redis in development mode');
      return null;
    }
    
    // Only throw in production
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
    
    return null;
  }
};

// Redis event handlers - only attach if we're in production or explicitly want Redis
if (process.env.NODE_ENV === 'production') {
  redis.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  redis.on('connect', () => {
    console.log('Redis Client Connected');
  });

  redis.on('ready', () => {
    console.log('Redis Client Ready');
  });

  redis.on('end', () => {
    console.log('Redis Client Disconnected');
  });
}

export default redis; 