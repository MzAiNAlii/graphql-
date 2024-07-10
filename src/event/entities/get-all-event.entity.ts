import { Field, ObjectType } from '@nestjs/graphql';
import { Event } from './event.entity';
import { PaginationQueryDto } from 'src/item/dto/pagination-query.dto';
import { Pagination } from 'src/item/entities/pagination.entity';

@ObjectType()
export class GetAllEvent {
  @Field(() => [Event], { nullable: true })
  event?: Event[];

  @Field({ nullable: true })
  pagination?: Pagination;
}
