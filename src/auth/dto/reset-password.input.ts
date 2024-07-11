import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ResetPasswordInput {
  @Field({ nullable: false })
  id: string;

  @Field({ nullable: false })
  password: string;

  @Field({ nullable: false })
  confirmPassword: string;
}
