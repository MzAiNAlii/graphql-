import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ItemImage {
  @Field({ nullable: true })
  id?: string;

  @Field()
  url: string;

  @Field()
  sequence: number = 0;

  @Field({ nullable: true })
  createdAt?: Date;
  @Field({ nullable: true })
  updatedAt?: Date;
}
