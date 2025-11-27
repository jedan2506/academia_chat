import Redis from 'ioredis';

let redis: Redis | null = null;

export const getRedisClient = (): Redis | null => {
    if (redis) {
        return redis;
    }

    try {
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
        redis = new Redis(redisUrl, {
            maxRetriesPerRequest: 3,
            retryStrategy: (times) => {
                if (times > 3) {
                    return null;
                }
                return Math.min(times * 100, 3000);
            },
            lazyConnect: true
        });

        redis.on('error', (error) => {
            console.error('Redis connection error:', error);
        });

        redis.connect().catch((error) => {
            console.error('Failed to connect to Redis:', error);
            redis = null;
        });

        return redis;
    } catch (error) {
        console.error('Error creating Redis client:', error);
        return null;
    }
};

export const disconnectRedis = async (): Promise<void> => {
    if (redis) {
        await redis.quit();
        redis = null;
    }
};

