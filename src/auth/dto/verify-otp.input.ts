import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class VerifyOtpInput {
  @Field({ nullable: false })
  id: string;

  @Field({ nullable: false })
  code: string;
}
