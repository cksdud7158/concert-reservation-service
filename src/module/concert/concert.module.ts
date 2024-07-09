import { Module } from "@nestjs/common";
import { ConcertController } from "@app/presentation/controller/concert/concert.controller";

@Module({ controllers: [ConcertController] })
export class ConcertModule {}
