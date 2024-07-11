import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Otp {
  @Field({ nullable: true })
  message: string;

  @Field((type) => User, { nullable: true })
  user?: User;
}
