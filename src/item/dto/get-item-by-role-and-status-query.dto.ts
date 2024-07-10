import { Field, InputType } from '@nestjs/graphql';

import { ItemRole, Role, Status } from '@prisma/client';
import { PaginationQueryDto } from './pagination-query.dto';

@InputType()
export class GetItemByRoleAndStatusQueryDto {
  @Field({ nullable: true })
  pagination: PaginationQueryDto;

  @Field()
  role: ItemRole;

  @Field({ nullable: true })
  status?: Status;

  @Field({ nullable: true })
  title?: string;
}
