import { Module } from "@nestjs/common";
import { ReservationController } from "@app/presentation/controller/reservation/reservation.controller";

@Module({ controllers: [ReservationController] })
export class ReservationModule {}
