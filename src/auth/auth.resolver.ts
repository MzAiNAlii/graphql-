import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Login } from './entities/login.entity';
import { Signup } from './entities/signup.entity';
import { UserSignupInput } from './dto/user-signup.input';
import { LoginInput } from './dto/login.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Signup)
  signup(@Args('userSignupInput') userSignupInput: UserSignupInput) {
    return this.authService.signup(userSignupInput);
  }

  @Mutation(() => Login)
  async login(@Args('loginInput') loginInput: LoginInput) {
    return await this.authService.login(loginInput);
  }
}
