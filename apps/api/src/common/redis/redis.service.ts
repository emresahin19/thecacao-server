import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';
import { redisHost, redisPass, redisPort } from '../constants';

@Injectable()
export class RedisService {
    private client;

    constructor() {
        this.client = createClient({
            url: `redis://${redisHost}:${redisPort}`,
            password: redisPass,
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
        await this.client?.set(key, JSON.stringify(value), { EX: ttl });
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }
}
