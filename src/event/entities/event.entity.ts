import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Status } from '@prisma/client';
import { EventAddress } from './event-address.entity';
import { Reserve } from './reserve.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Event {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  photoUrl?: string;

  @Field({ nullable: true })
  status?: Status;

  @Field({ nullable: true })
  eventAddress?: EventAddress;

  @Field({ nullable: true })
  eventDate?: Date;

  @Field({ nullable: true })
  startDateTime?: Date;

  @Field({ nullable: true })
  endDateTime?: Date;

  @Field({ nullable: true })
  reserve?: boolean;

  @Field({ nullable: true })
  user?: User;
}
