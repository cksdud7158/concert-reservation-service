const env = process.env.NODE_ENV;

const RedisKey = {
  WAITING_USERS: env + "-WAITING_USERS",
  ACTIVE_USERS: env + "-ACTIVE_USERS",
  ACTIVE_NUM: env + "_ACTIVE_NUM",
  SCHEDULE: env + "-SCHEDULE",
} as const;

export default RedisKey;
