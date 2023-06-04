import { createClient } from 'redis';

// Create a cache client instance
const createCacheClient = async (options) => {
    const client = createClient(options);
    await client.connect();

    client.on('error', err => console.log('Redis Client Error', err));


    // Define cache interface methods
    const cacheInterface = {
        get: async (key) => {
            const value = await client.get(key);
            return JSON.parse(value);
        },
        set: async (key, value, expiresIn = 0) => {
            const stringValue = JSON.stringify(value);
            if (expiresIn > 0) {
                await client.set(key, stringValue, 'EX', expiresIn);
            } else {
                await client.set(key, stringValue);
            }
        },
        del: async (key) => {
            await client.del(key);
        },
        quit: () => {
            client.quit();
        },
    };

    return cacheInterface;
};

export { createCacheClient };
