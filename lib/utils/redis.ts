import { createClient } from 'redis';

let redisClient: any;

export const getRedisClient = async () => {
  if (!redisClient) {
    redisClient = createClient({
      url: 'redis://localhost:6379',
    });

    redisClient.on('error', (err: any) => console.error('Redis Client Error', err));

    await redisClient.connect(); // Sadece ilk seferde bağlanır
  }

  return redisClient;
};
