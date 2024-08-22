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
    new winston.transports.File({
      filename: "logs/application.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      maxsize: 1024 * 1024 * 100, // 20 MB 파일 크기 제한
      maxFiles: 5, // 최대 5개의 파일 유지
    }),
  ],
};
