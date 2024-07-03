import { IsInt } from "class-validator";

export class SignInRequest {
  @IsInt()
  userId: number;
}
