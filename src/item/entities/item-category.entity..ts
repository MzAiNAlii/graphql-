import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ItemCategory {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  type: string;

  @Field({ nullable: true })
  createdAt?: Date;
  @Field({ nullable: true })
  updatedAt?: Date;
}
