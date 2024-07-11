import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ResendOtpInput {
  @Field({ nullable: false })
  id: string;
}
