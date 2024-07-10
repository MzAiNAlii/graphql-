import {
  UserAddressDto,
  UserSignupInput,
} from 'src/auth/dto/user-signup.input';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@InputType()
export class UpdateUserInput extends PartialType(UserSignupInput) {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field({ nullable: true })
  address?: UserAddressDto;

  @Field(() => String, { nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  role?: Role;

  @Field(() => String, { nullable: true })
  imageUrl?: string;
}
