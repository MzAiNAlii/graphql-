import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SendOtpInput {
  @Field({ nullable: false })
  email: string;
}
