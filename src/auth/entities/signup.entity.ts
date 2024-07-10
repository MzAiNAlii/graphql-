import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import { UserAddressDto } from '../dto/user-signup.input';

@ObjectType()
export class Signup {
  @Field()
  message: string;

  @Field(() => User)
  user: User;
}
