import { Module } from "@nestjs/common";
import { PointController } from "../../../presentation/point/point.controller";

@Module({ controllers: [PointController] })
export class PointModule {}
