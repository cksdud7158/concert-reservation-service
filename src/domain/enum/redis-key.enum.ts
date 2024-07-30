const RedisKey = {
  WAITING_TOKENS: process.env.NODE_ENV + "-WAITING_TOKENS",
  ACTIVE_TOKENS: process.env.NODE_ENV + "-ACTIVE_TOKENS",
} as const;

export default RedisKey;
