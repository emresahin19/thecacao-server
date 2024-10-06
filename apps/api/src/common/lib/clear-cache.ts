import axios from 'axios';
import { revalidateSecretToken, WWW_URL } from '../constants';
import { RedisService } from '../redis/redis.service';

export async function clearCache({cacheKey, revalidatePath}: {cacheKey: string, revalidatePath?: string}) {
    const redisService = new RedisService();
    await redisService.del(cacheKey);
    try {
        await axios.post(`${WWW_URL}/api/revalidate`, {
            secret: revalidateSecretToken,
            ...revalidatePath && { revalidatePath }
        });
        console.log(`Revalidate request sent`);
    } catch (error) {
        console.error(`Revalidate request failed `, error.message);
    }
}