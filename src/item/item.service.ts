import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { ItemRole, Prisma, Status, User } from '@prisma/client';
import { GetItemQueryDto, SortingTypeDto } from './dto/get-item-query.dto';
import * as turf from '@turf/turf';
import { Pagination } from './entities/pagination.entity';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Item } from './entities/item.entity';
import { GetItemByRoleAndStatusQueryDto } from './dto/get-item-by-role-and-status-query.dto';

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User, payload: CreateItemInput) {
    try {
      let category = undefined;
      if (
        payload.itemRole == ItemRole.VENDOR ||
        payload.itemRole === ItemRole.BUSINESS
      ) {
        category = await this.prisma.itemCategory.findUnique({
          where: { id: payload.itemCategory.id },
        });
      }

      const itemData = await this.prisma.item.create({
        data: {
          ...payload,
          user: { connect: { id: user.id } },
          userRole: user.role,
          itemAddress: {
            create: { ...payload.itemAddress },
          },
          itemImage: {
            create: { ...payload.itemImage },
          },
          itemCategory: category ? { connect: { id: category.id } } : undefined,
        },
        include: {
          itemAddress: true,
          itemImage: true,
          itemCategory: true,
        },
      });

      return itemData;
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  async getItem(user: User, query: GetItemQueryDto) {
    try {
      // if (query.categoryName) {
      //   return await this.categoryService.getCategoriesWithItem(user, query);
      // }

      let prismaQuery = {
        where: {},
        orderBy: {},
        take: +query.size || 10,
        skip: (query.page - 1) * (query.size || 10) || undefined,
        include: {
          itemImage: true,
          favorite: {
            where: {
              userId: user.id,
            },
          },
        },
      };

      if (!query.itemRole) {
        prismaQuery.orderBy = { approvalDateTime: 'desc' };
      }

      if (query.itemRole) {
        prismaQuery.orderBy = { createdAt: 'desc' };
      }

      if (query.sortType === SortingTypeDto.MOST_RECENTS) {
        prismaQuery.orderBy = { approvalDateTime: 'desc' };
      } else if (query.sortType === SortingTypeDto.PRICE_LOW_TO_HIGH) {
        prismaQuery.orderBy = { price: 'asc' };
      } else if (query.sortType === SortingTypeDto.PRICE_HIGH_TO_LOW) {
        prismaQuery.orderBy = { price: 'desc' };
      }

      prismaQuery.where = {
        title:
          {
            contains: query.title,
            mode: 'insensitive',
          } || undefined,
        userRole: query.filter || undefined,
        status: Status.APPROVED,
        itemRole: query.itemRole,
      };

      if (query.latitude && query.longitude && query.radius) {
        const center = turf.point([query.longitude, query.latitude]);
        const radiusInMiles = query.radius * 0.621371;
        const options: any = { steps: 10, units: 'miles' };
        const circle = turf.circle(center, radiusInMiles, options);
        const bbox = turf.bbox(circle);
        const minLongitude = bbox[0];
        const minLatitude = bbox[1];
        const maxLongitude = bbox[2];
        const maxLatitude = bbox[3];
        prismaQuery.where = {
          userRole: query.filter || undefined,
          status: Status.APPROVED,
          itemRole: query.itemRole,
          itemAddress: {
            latitude: {
              gte: minLatitude,
              lte: maxLatitude,
            },
            longitude: {
              gte: minLongitude,
              lte: maxLongitude,
            },
          },
        };
      }

      const totalItems = await this.prisma.item.count({
        where: prismaQuery.where,
      });

      const items = await this.prisma.item.findMany(prismaQuery);

      const totalPages = Math.ceil(totalItems / query.size);

      const response = items.map((item) => {
        return {
          ...item,
          isFavorite: item.favorite.length > 0,
        };
      });

      return {
        item: response,
        pagination: {
          currentPage: query.page,
          pageSize: query.size,
          totalPages,
          total: totalItems,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async findItemById(id: string, options?: any) {
    let whereClause = {
      where: {
        id,
      },
      include: {
        user: true,
        itemImage: true,
        itemAddress: true,
        itemCategory: true,
      },
    };
    if (options) {
      whereClause = { ...whereClause, ...options };
    }
    let existingUser: any;
    existingUser = await this.prisma.item.findUnique(whereClause);

    existingUser.user.password = undefined;
    return existingUser;
  }

  async getPostsByItemRole(itemRole: string) {
    return await this.prisma.item.findMany({
      where: {
        itemRole: itemRole as ItemRole,
      },
    });
  }

  async getUserPost(user: User, query: PaginationQueryDto) {
    try {
      if (query.page == 0) {
        query.page = 1;
      }
      let take = query.size;
      let skip = query.size * (query.page - 1);
      const posts = await this.prisma.item.findMany({
        where: {
          userId: user.id,
        },
        include: {
          itemAddress: true,
          itemImage: true,
        },
        take: +take,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
      });

      const totalPosts = await this.prisma.item.count({
        where: {
          userId: user.id,
        },
        take: +take,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
      });
      const totalPages = Math.ceil(totalPosts / take);

      return {
        item: posts,
        pagination: {
          currentPage: query.page,
          pageSize: query.size,
          totalPages,
          total: totalPosts,
        },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Item not found');
        }
      }
      throw error;
    }
  }

  async getItemByRoleAndStatus(query: GetItemByRoleAndStatusQueryDto) {
    try {
      if (query.pagination.page == 0) {
        query.pagination.page = 1;
      }

      let take = query.pagination.size;
      let skip = query.pagination.size * (query.pagination.page - 1);
      let whereClause: Prisma.ItemWhereInput = {
        title:
          {
            contains: query.title,
            mode: 'insensitive',
          } || undefined,
        itemRole: query.role,
      };

      if (query.status) {
        whereClause['status'] = query.status;
      }

      const data = await this.prisma.item.findMany({
        where: whereClause,
        include: {
          itemImage: {
            where: {
              sequence: 1,
            },
          },
        },
        take: +take,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
      });

      const totalitems = await this.prisma.item.count({
        where: whereClause,
      });
      const totalPages = Math.ceil(totalitems / take);

      return {
        item: data,
        pagination: {
          currentPage: query.pagination.page,
          pageSize: query.pagination.size,
          totalPages,
          total: totalitems,
        },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('not found');
        }
      }
      throw error;
    }
  }

  async getItemByRoleDetail(user: User, id: string) {
    const items = await this.prisma.item.findFirst({
      where: {
        id,
      },
      include: {
        user: true,
        itemAddress: true,
        itemImage: true,
        itemCategory: true,
        favorite: {
          where: {
            userId: user.id,
          },
        },
      },
    });
  }
}
