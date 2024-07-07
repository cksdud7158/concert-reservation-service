import { Module } from "@nestjs/common";
import { PaymentController } from "../../presentation/controller/payment/payment.controller";

@Module({ controllers: [PaymentController] })
export class PaymentModule {}
