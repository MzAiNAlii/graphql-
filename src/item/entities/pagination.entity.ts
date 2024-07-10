import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Pagination {
  @Field({ nullable: true })
  currentPage?: number;

  @Field({ nullable: true })
  pageSize?: number;

  @Field({ nullable: true })
  totalPages?: number;

  @Field({ nullable: true })
  total?: number;
}
