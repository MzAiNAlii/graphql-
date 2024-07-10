import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserAddress {
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
