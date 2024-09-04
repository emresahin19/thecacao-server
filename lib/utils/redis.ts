import Redis from 'ioredis';

class RedisService {
  private redis: Redis;
  private retry: number;

  constructor() {
    this.redis = new Redis({
      host: process.env.NEXT_PUBLIC_REDIS_HOST || '127.0.0.1',
      port: process.env.NEXT_PUBLIC_REDIS_PORT ? parseInt(process.env.NEXT_PUBLIC_REDIS_PORT, 10) : 6379,
      password: process.env.NEXT_PUBLIC_REDIS_PASSWORD,
      db: Number(process.env.NEXT_PUBLIC_REDIS_DB) || 2,
      connectTimeout: Number(process.env.NEXT_PUBLIC_REDIS_DB) || 3000, 
    });

    this.retry = 0;

    this.redis.on('error', (err) => {
      if (this.retry > 2) {
        // console.error('Redis connection failed');
        this.redis.disconnect();
        this.retry++;
      }
    });
  }

  async getSerializedData(key: string) {
    try {
      const data = await this.redis.get(key);

      if (!data) return [];

      // Veri formatını kontrol et
      const serializedMatch = data.match(/s:\d+:"(\[.*\])";/);
      const jsonMatch = data.match(/s:\d+:"({.*})";/);

      if (serializedMatch) {
        const jsonString = serializedMatch[1];
        return JSON.parse(jsonString);
      } else if (jsonMatch) {
        const jsonString = jsonMatch[1];
        return JSON.parse(jsonString);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      // console.error('Failed to fetch data from Redis:', error);
      return null;
    }
  }
}

export default new RedisService();
