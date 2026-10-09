import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});

redisClient.on('error', (err) => {
  console.error('Redis error: ', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis server successfully!');
});

export default redisClient;
