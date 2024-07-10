import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Status, Prisma, ReserveStatus } from '@prisma/client';
import { PaginationQueryDto } from 'src/item/dto/pagination-query.dto';
import { UpdateEventStatusInput } from './dto/update-event.input';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, payload: CreateEventInput) {
    const eventData = await this.prisma.event.create({
      data: {
        ...payload,
        user: { connect: { id: userId } },
        eventAddress: {
          create: { ...payload.eventAddress },
        },
      },
      include: { eventAddress: true },
    });
    return eventData;
  }

  async getEventDetail(id: string, userId?: string) {
    const eventDetail: any = await this.prisma.event.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            name: true,
            imageUrl: true,
            email: true,
            phoneNumber: true,
          },
        },
        eventAddress: true,
        reserve: {
          where:
            {
              userId: userId || undefined,
            } || undefined,
        },
      },
    });

    return {
      ...eventDetail,
      user: eventDetail.user,
      eventAddress: eventDetail.eventAddress
        ? {
            ...eventDetail.eventAddress,
            longitude: eventDetail.eventAddress.longitude.toString(),
            latitude: eventDetail.eventAddress.latitude.toString(),
          }
        : null,
      reserve: eventDetail.reserve.length > 0,
    };
  }

  async getAllEvents(userId: string, query: PaginationQueryDto) {
    try {
      if (query.page == 0) {
        query.page = 1;
      }

      let take = query.size;
      let skip = query.size * (query.page - 1);
      const events = await this.prisma.event.findMany({
        where: {
          status: Status.APPROVED,
          userId: {
            not: userId,
          },
        },
        include: {
          eventAddress: true,
          reserve: {
            where: {
              userId,
            },
          },
        },
        take: +take,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
      });

      const totalEvents = await this.prisma.event.count({
        where: {
          status: Status.APPROVED,
          userId: {
            not: userId,
          },
        },
      });
      const totalPages = Math.ceil(totalEvents / take);

      const newEvents = events.map((event) => {
        return {
          ...event,
          reserve: event.reserve.length > 0,
        };
      });

      return {
        event: newEvents,
        pagination: {
          currentPage: query.page,
          pageSize: query.size,
          totalPages,
          total: totalEvents,
        },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Events not found');
        }
      }
      throw error;
    }
  }

  async getUserEvents(userId: string, query: PaginationQueryDto) {
    try {
      if (query.page == 0) {
        query.page = 1;
      }

      let take = query.size;
      let skip = query.size * (query.page - 1);
      const events = await this.prisma.event.findMany({
        where: {
          userId,
        },
        include: {
          eventAddress: true,
        },
        take: +take,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
      });

      const totalEvents = await this.prisma.event.count({
        where: {
          userId,
        },
        take: +take,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
      });
      const totalPages = Math.ceil(totalEvents / take);

      return {
        event: events,
        pagination: {
          currentPage: query.page,
          pageSize: query.size,
          totalPages,
          total: totalEvents,
        },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Events not found');
        }
      }
      throw error;
    }
  }

  async createReserveEvent(userId: string, eventId: string) {
    try {
      return await this.prisma.reserve.create({
        data: {
          eventId: eventId,
          userId: userId,
          status: ReserveStatus.RESERVED,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getUserReserveEvent(userId: string, query: PaginationQueryDto) {
    try {
      if (query.page == 0) {
        query.page = 1;
      }

      let take = query.size;
      let skip = query.size * (query.page - 1);
      const reserveEvents = await this.prisma.reserve.findMany({
        where: {
          userId,
          status: ReserveStatus.RESERVED,
        },
        include: {
          event: {
            include: {
              eventAddress: true,
            },
          },
        },
        take: +take,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
      });

      const totalEvents = await this.prisma.reserve.count({
        where: {
          userId,
          status: ReserveStatus.RESERVED,
        },

        take: +take,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
      });
      const totalPages = Math.ceil(totalEvents / query.size);

      return {
        reserve_event: reserveEvents,
        pagination: {
          currentPage: query.page,
          pageSize: query.size,
          totalPages,
          total: totalEvents,
        },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Reserve events not found');
        }
      }
      throw error;
    }
  }

  async getReserveEventDetail(id: string) {
    try {
      return await this.prisma.reserve.findUnique({
        where: {
          id,
        },
        include: {
          user: {
            select: {
              name: true,
              imageUrl: true,
              email: true,
              phoneNumber: true,
            },
          },
          event: {
            include: {
              eventAddress: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new NotFoundException('Reserve events not found');
          }
        }
        throw error;
      }
      throw error;
    }
  }

  async updateEventStatus(updateEventInput: UpdateEventStatusInput) {
    try {
      const updatedEvent = await this.prisma.event.update({
        where: {
          id: updateEventInput.eventId,
        },
        data: {
          status: updateEventInput.status,
        },
      });

      if (updateEventInput.status === Status.APPROVED) {
        return {
          message: 'Event Approved',
          ...updatedEvent,
        };
      }

      return {
        message: 'Event Rejected',
        ...updatedEvent,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new NotFoundException('Events not found');
        }
      }
      throw error;
    }
  }
}
