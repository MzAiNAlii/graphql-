import { Field, ObjectType } from '@nestjs/graphql';
import { Event } from './event.entity';
import { Pagination } from 'src/item/entities/pagination.entity';
import { Reserve } from './reserve.entity';

@ObjectType()
export class GetUserReservedEvent {
  @Field(() => [Reserve], { nullable: true })
  reserve_event?: Reserve[];

  @Field({ nullable: true })
  pagination?: Pagination;
}
