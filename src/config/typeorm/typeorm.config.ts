import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { resolve } from "path";

export const typeORMConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: "postgres",
  port: 5432,
  username: "root",
  password: "password",
  database: "concert-reservation-service",
  autoLoadEntities: true,
  entities: [
    resolve(__dirname, "../../../dist/infrastructure/**/*.entity{.ts,.js}"),
  ],
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
  // logging: true,
};
