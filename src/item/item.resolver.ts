import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ItemService } from './item.service';
import { Item } from './entities/item.entity';
import { CreateItemInput } from './dto/create-item.input';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt-guard';
import { GetUser } from 'src/decorator/user.decorator';
import { User } from '@prisma/client';
import { GetItemQueryDto } from './dto/get-item-query.dto';
import { GetItem } from './entities/get-item.entity';
import { Pagination } from './entities/pagination.entity';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { GetItemByRoleAndStatusQueryDto } from './dto/get-item-by-role-and-status-query.dto';

@Resolver(() => Item)
export class ItemResolver {
  constructor(private readonly itemService: ItemService) {}

  @Mutation(() => Item)
  @UseGuards(JwtGuard)
  createItem(
    @GetUser() user: User,
    @Args('createItemInput') createItemInput: CreateItemInput,
  ) {
    let payload: any = createItemInput;
    if (payload.itemImage && payload.itemImage.length > 0) {
      payload.itemImage = payload.itemImage.map((image) => {
        if (!image.url) {
          throw new Error('Each itemImage must have a non-null url');
        }
        return image;
      });
    }

    return this.itemService.create(user, payload);
  }

  @Query(() => GetItem, { name: 'getItem' })
  @UseGuards(JwtGuard)
  getItem(
    @GetUser() user: User,
    @Args('query') getItemQueryDto: GetItemQueryDto,
  ) {
    return this.itemService.getItem(user, getItemQueryDto);
  }

  @Query(() => Item, { name: 'getItemDetailById' })
  findItemById(@Args('id', { type: () => String }) id: string) {
    return this.itemService.findItemById(id);
  }

  @Query(() => [Item], { name: 'getPostsByItemRole' })
  getPostsByItemRole(
    @Args('itemRole', { type: () => String }) itemRole: string,
  ) {
    return this.itemService.getPostsByItemRole(itemRole);
  }

  @Query(() => GetItem, { name: 'getUserPost' })
  @UseGuards(JwtGuard)
  getUserPost(
    @GetUser() user,
    @Args('query') paginationQueryDto: PaginationQueryDto,
  ) {
    return this.itemService.getUserPost(user, paginationQueryDto);
  }

  @Query(() => GetItem, { name: 'getItemByRoleAndStatus' })
  @UseGuards(JwtGuard)
  getItemByRoleAndStatus(
    @Args('query')
    getItemByRoleAndStatusQueryDto: GetItemByRoleAndStatusQueryDto,
  ) {
    return this.itemService.getItemByRoleAndStatus(
      getItemByRoleAndStatusQueryDto,
    );
  }

  @Query(() => Item, { name: 'getItemByRoleDetail' })
  @UseGuards(JwtGuard)
  getItemByRoleDetail(
    @GetUser() user,
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.itemService.getItemByRoleDetail(user, id);
  }
}
