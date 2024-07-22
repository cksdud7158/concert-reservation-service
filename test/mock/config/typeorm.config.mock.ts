import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

export const typeormConfigMock: TypeOrmModuleOptions = {
  type: "postgres",
  host: "localhost",
  port: 5555,
  username: "root",
  password: "password",
  database: "concert-reservation-service",
  entities: ["dist/infrastructure/**/*.entity{.ts,.js}"],
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
};
