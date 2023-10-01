import { SetOptions, createClient } from 'redis';
import config from '../config';
// import { errorLogger, infoLogger } from "./logger";

const redisClient = createClient({
  url: config.redis.url,
});

const redisPubClient = createClient({
  url: config.redis.url,
});

const redisSubClient = createClient({
  url: config.redis.url,
});

// redisClient.on("error", (err) => infoLogger.error("RedisError", err));
// redisClient.on("connect", (err) => errorLogger.info("Redis connected", err));
// redisPubClient.on("error", (err) => infoLogger.error("RedisError pub", err));
// redisPubClient.on("connect", (err) => errorLogger.info("Redis pub connected", err));
// redisSubClient.on("error", (err) => infoLogger.error("RedisError sub", err));
// redisSubClient.on("connect", (err) => errorLogger.info("Redis sub connected", err));

redisClient.on('error', (err: any) => console.warn('RedisError', err));
redisClient.on('connect', (err: any) => console.log('Redis connected', err));

const connect = async (): Promise<void> => {
  await redisClient.connect();
  await redisPubClient.connect();
  await redisSubClient.connect();
};

const set = async (
  key: string,
  value: string,
  options?: SetOptions
): Promise<void> => {
  await redisClient.set(key, value, options);
};

const get = async (key: string): Promise<string | null> => {
  return await redisClient.get(key);
};

const del = async (key: string): Promise<void> => {
  await redisClient.del(key);
};

const setAccessToken = async (userId: string, token: string): Promise<void> => {
  const key = `access-token:${userId}`;
  await redisClient.set(key, token, { EX: Number(config.redis.expires_in) });
};

const getAccessToken = async (userId: string): Promise<string | null> => {
  const key = `access-token:${userId}`;
  return await redisClient.get(key);
};

const delAccessToken = async (userId: string): Promise<void> => {
  const key = `access-token:${userId}`;
  await redisClient.del(key);
};

const disconnect = async (): Promise<void> => {
  await redisClient.quit();
  await redisPubClient.quit();
  await redisSubClient.quit();
};

export const RedisClient = {
  connect,
  set,
  get,
  del,
  setAccessToken,
  getAccessToken,
  delAccessToken,
  disconnect,
  publish: redisPubClient.publish.bind(redisPubClient),
  subscribe: redisSubClient.subscribe.bind(redisSubClient),
};
