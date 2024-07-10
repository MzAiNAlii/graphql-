import { Field, InputType } from '@nestjs/graphql';
import { Role, ItemRole } from '@prisma/client';

export enum SortingTypeDto {
  MOST_RECENTS = 'MOST_RECENTS',
  PRICE_LOW_TO_HIGH = 'PRICE_LOW_TO_HIGH',
  PRICE_HIGH_TO_LOW = 'PRICE_HIGH_TO_LOW',
}

@InputType()
export class GetItemQueryDto {
  @Field({ nullable: true })
  latitude?: number;

  @Field({ nullable: true })
  longitude?: number;

  @Field({ nullable: true })
  radius?: number;

  @Field({ nullable: true })
  page?: number;

  @Field({ nullable: true })
  size?: number;

  @Field({ nullable: true })
  sortType?: SortingTypeDto;

  @Field({ nullable: true })
  filter?: Role;

  @Field({ nullable: true })
  itemRole?: ItemRole;

  @Field({ nullable: true })
  categoryName?: string;

  @Field({ nullable: true })
  title?: string;
}
