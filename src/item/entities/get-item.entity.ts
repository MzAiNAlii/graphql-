import { Field, ObjectType } from '@nestjs/graphql';
import { Item } from './item.entity';
import { Pagination } from './pagination.entity';

export enum SortingTypeDto {
  MOST_RECENTS = 'MOST_RECENTS',
  PRICE_LOW_TO_HIGH = 'PRICE_LOW_TO_HIGH',
  PRICE_HIGH_TO_LOW = 'PRICE_HIGH_TO_LOW',
}

@ObjectType()
export class GetItem {
  @Field(() => [Item], { nullable: true })
  item?: Item[];

  @Field(() => Pagination, { nullable: true })
  pagination?: Pagination;
}
