import { Module } from "@nestjs/common";
import { ReservationController } from "../../../presentation/reservation/reservation.controller";

@Module({ controllers: [ReservationController] })
export class ReservationModule {}
