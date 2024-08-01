const env = process.env.NODE_ENV;

const RedisKey = {
  WAITING_TOKENS: env + "-WAITING_TOKENS",
  ACTIVE_TOKENS: env + "-ACTIVE_TOKENS",
  ACTIVE_NUM: env + "_ACTIVE_NUM",
  SCHEDULE: env + "-SCHEDULE",
} as const;

export default RedisKey;
