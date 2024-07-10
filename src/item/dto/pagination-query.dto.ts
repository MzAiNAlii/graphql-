import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PaginationQueryDto {
  @Field()
  page?: number;
  @Field()
  size?: number;
}
