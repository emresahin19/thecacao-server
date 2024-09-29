import { createClient } from 'redis';

export class RedisService {
    private static client: any;

    constructor() {
        if (!RedisService.client) {
            RedisService.client = createClient({
                url: `redis://${process.env.NEXT_PUBLIC_REDIS_HOST}:${process.env.NEXT_PUBLIC_REDIS_PORT}`,
                password: process.env.NEXT_PUBLIC_REDIS_PASSWORD,
            });

            RedisService.client.on('error', (err: any) => console.error('Redis Client Error', err));

            RedisService.client.connect().then(() => {
                console.log('Connected to Redis');
            });
        }
    }

    async get(key: string): Promise<any> {
        const data = await RedisService.client?.get(key);
        return data ? JSON.parse(data) : null;
    }

    async set(key: string, value: any, ttl: number = 3600): Promise<void> {
        await RedisService.client?.set(key, JSON.stringify(value), { EX: ttl });
    }

    async del(key: string): Promise<void> {
        await RedisService.client?.del(key);
    }
}
