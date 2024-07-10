import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';

@ObjectType()
export class Login {
  @Field()
  message: string;

  @Field()
  token: string;

  @Field((type) => User)
  user: User;
}
