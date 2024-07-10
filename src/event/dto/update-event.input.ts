import { Field, InputType } from '@nestjs/graphql';
import { Status } from '@prisma/client';

@InputType()
export class UpdateEventStatusInput {
  @Field()
  eventId: string;

  @Field()
  status: Status;
}
