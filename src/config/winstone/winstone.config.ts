import { utilities, WinstonModuleOptions } from "nest-winston";
import * as winston from "winston";

export const winstoneConfig: WinstonModuleOptions = {
  transports: [
    new winston.transports.Console({
      level: "silly",
      format: winston.format.combine(
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
        winston.format.timestamp(),
        winston.format.ms(),
        utilities.format.nestLike("concert-token", {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
  ],
  // 파일 로깅을 원하면 다음과 같이 추가할 수 있습니다.
  // new winston.transports.File({ filename: 'combined.log' }),
};
