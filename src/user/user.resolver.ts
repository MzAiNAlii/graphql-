import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt-guard';
import { GetUser } from 'src/decorator/user.decorator';
import { Message } from './entities/message.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'geAllUser' })
  findAll() {
    return this.userService.getUsers();
  }

  @Mutation(() => User, { name: 'updateUser' })
  @UseGuards(JwtGuard)
  updateUser(
    @GetUser('id') userId: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.userService.updateUser(userId, updateUserInput);
  }

  @Mutation(() => Message, { name: 'deleteUser' })
  @UseGuards(JwtGuard)
  deleteUser(@GetUser() user) {
    return this.userService.deleteUser(user);
  }
}
