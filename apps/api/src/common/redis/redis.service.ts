import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
    private client;
    private isDevMode = !(process.env.NEXT_PUBLIC_APP_MODE === 'development');

    constructor() {
        this.client = createClient({
            url: `redis://${process.env.NEXT_PUBLIC_REDIS_HOST}:${process.env.NEXT_PUBLIC_REDIS_PORT}`,
            password: process.env.NEXT_PUBLIC_REDIS_PASSWORD,
        });

        this.client.on('error', (err: any) => console.error('Redis Client Error', err));

        this.client.connect().then(() => {
            console.log('Connected to Redis');
        });
    }

    async get(key: string): Promise<any> {
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
    }

    async set(key: string, value: any, ttl: number = 3600): Promise<void> {
        await this.client.set(key, JSON.stringify(value), 'EX', ttl); // TTL: 1 saat (3600 saniye)
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }
}
