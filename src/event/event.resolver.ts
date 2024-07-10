import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EventService } from './event.service';
import { Event } from './entities/event.entity';
import { CreateEventInput } from './dto/create-event.input';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt-guard';
import { GetUser } from 'src/decorator/user.decorator';
import { PaginationQueryDto } from 'src/item/dto/pagination-query.dto';
import { GetAllEvent } from './entities/get-all-event.entity';
import { Reserve } from './entities/reserve.entity';
import { GetUserReservedEvent } from './entities/get-user-reserved-event.entity';
import { UpdateEventStatusInput } from './dto/update-event.input';

@Resolver()
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Mutation(() => Event, { name: 'createEvent' })
  @UseGuards(JwtGuard)
  createEvent(
    @GetUser('id') userId: string,

    @Args('createEventInput') createEventInput: CreateEventInput,
  ) {
    return this.eventService.create(userId, createEventInput);
  }

  @UseGuards(JwtGuard)
  @Query(() => Event, { name: 'getEventDetail' })
  getEventDetail(@GetUser('id') userId: string, @Args('id') id: string) {
    return this.eventService.getEventDetail(id, userId);
  }

  @UseGuards(JwtGuard)
  @Query(() => GetAllEvent, { name: 'getAllEvents' })
  getAllEvents(
    @GetUser('id') userId: string,
    @Args('query') query: PaginationQueryDto,
  ) {
    return this.eventService.getAllEvents(userId, query);
  }

  @UseGuards(JwtGuard)
  @Query(() => GetAllEvent, { name: 'getUserEvent' })
  getUserEvents(
    @GetUser('id') userId: string,
    @Args('query') query: PaginationQueryDto,
  ) {
    return this.eventService.getUserEvents(userId, query);
  }

  @Mutation(() => Reserve, { name: 'createReserveEvent' })
  @UseGuards(JwtGuard)
  createReserveEvent(
    @GetUser('id') userId: string,
    @Args('eventId') eventId: string,
  ) {
    return this.eventService.createReserveEvent(userId, eventId);
  }

  @UseGuards(JwtGuard)
  @Query(() => GetUserReservedEvent, { name: 'getUserReserveEvent' })
  getUserReservedEvent(
    @GetUser('id') userId: string,
    @Args('query') query: PaginationQueryDto,
  ) {
    return this.eventService.getUserReserveEvent(userId, query);
  }

  @Query(() => Reserve, { name: 'getReserveEventDetail' })
  getReserveEventDetail(@Args('id', { type: () => String }) id: string) {
    return this.eventService.getReserveEventDetail(id);
  }

  @Mutation(() => Event, { name: 'updateEventStatus' })
  updateEventStatus(
    @Args('updateEventStatusInput')
    updateEventStatusInput: UpdateEventStatusInput,
  ) {
    return this.eventService.updateEventStatus(updateEventStatusInput);
  }
}
