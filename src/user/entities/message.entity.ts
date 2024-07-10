import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Message {
  @Field()
  message: string;
}
