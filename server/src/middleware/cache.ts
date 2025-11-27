import { Request, Response, NextFunction } from 'express';
import { getRedisClient } from '../config/redis';

export const cacheMiddleware = (ttl: number = 300) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req.method !== 'GET') {
            return next();
        }

        const redis = getRedisClient();
        if (!redis) {
            return next();
        }

        const userId = req.user?.id;
        if (!userId) {
            return next();
        }

        const cacheKey = `cache:${userId}:${req.originalUrl}`;

        try {
            const cachedData = await redis.get(cacheKey);
            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }

            const originalJson = res.json.bind(res);
            res.json = (data: any) => {
                redis.setex(cacheKey, ttl, JSON.stringify(data)).catch(console.error);
                return originalJson(data);
            };

            next();
        } catch (error) {
            console.error('Cache middleware error:', error);
            next();
        }
    };
};

export const invalidateUserCache = async (userId: string, pattern: string = '*') => {
    const redis = getRedisClient();
    if (!redis) {
        return;
    }

    try {
        const keys = await redis.keys(`cache:${userId}:${pattern}`);
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    } catch (error) {
        console.error('Cache invalidation error:', error);
    }
};

