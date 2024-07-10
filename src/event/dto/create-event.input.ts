import { InputType, Int, Field } from '@nestjs/graphql';
import { Status } from '@prisma/client';

@InputType()
export class EventAddressInput {
  @Field({ nullable: true })
  id?: string;

  @Field()
  longitude: number;

  @Field()
  latitude: number;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  country: string;

  @Field()
  address: string;

  @Field({ nullable: true })
  eventId?: string;
}

@InputType()
export class CreateEventInput {
  @Field({ nullable: true })
  id?: string;

  // @Field(() => String)
  // userId: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  photoUrl: string;

  @Field({ nullable: true })
  status?: Status;

  @Field()
  eventAddress?: EventAddressInput;

  @Field()
  eventDate: Date;

  @Field()
  startDateTime: Date;

  @Field()
  endDateTime: Date;
}
