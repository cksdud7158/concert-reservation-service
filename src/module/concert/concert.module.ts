import { Module } from "@nestjs/common";
import { ConcertController } from "../../presentation/controller/concert/concert.controller";

@Module({ controllers: [ConcertController] })
export class ConcertModule {}
