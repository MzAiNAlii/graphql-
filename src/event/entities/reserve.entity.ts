import { Field, ObjectType } from '@nestjs/graphql';
import { Event } from './event.entity';
import { User } from 'src/user/entities/user.entity';
import { Pagination } from 'src/item/entities/pagination.entity';

@ObjectType()
export class Reserve {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  event?: Event;

  @Field({ nullable: true })
  user?: User;

  @Field({ nullable: true })
  eventId?: string;

  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  createdAt?: string;

  @Field({ nullable: true })
  updatedAt?: string;

  @Field({ nullable: true })
  pagination: Pagination;
}
