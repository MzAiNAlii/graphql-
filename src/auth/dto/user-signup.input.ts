import { Field, InputType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@InputType()
export class UserAddressDto {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  zipCode?: string;

  @Field({ nullable: true })
  longitude?: number;

  @Field({ nullable: true })
  latitude?: number;

  @Field({ nullable: true })
  userId?: string;
}

@InputType()
export class UserSignupInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  role: Role;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  address?: UserAddressDto;
}
