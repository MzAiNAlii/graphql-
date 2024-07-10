import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserAddress } from './user-address.entity';
import { Role } from '@prisma/client';

@ObjectType()
export class User {
  @Field({ nullable: true })
  id?: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  role?: Role;

  @Field({ nullable: true })
  address?: UserAddress;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
