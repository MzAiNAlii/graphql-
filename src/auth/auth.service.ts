import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserSignupInput } from './dto/user-signup.input';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private assignJwtToken(user: User) {
    return this.jwtService.sign({
      id: user.id,
      email: user.email,
    });
  }

  private hashPassword(password: string) {
    return bcrypt.hashSync(password, 10);
  }

  async signup(payload: UserSignupInput) {
    try {
      payload.password = this.hashPassword(payload.password);
      const user = await this.userService.create(payload);
      return {
        message: 'Signup Successfully',
        user: user,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new ConflictException('Email Aleady Exist');
        }
      }
      throw error;
    }
  }

  async login(dto: LoginInput) {
    try {
      const user = await this.userService.findUserByEmail(dto.email);

      if (!user) {
        throw new ForbiddenException('Invalid Credentials');
      }
      const matchPassword = bcrypt.compareSync(dto.password, user.password);
      if (!matchPassword) {
        throw new ForbiddenException('Invalid Credentials');
      }
      const token = this.assignJwtToken(user);

      delete user.password;
      return {
        message: 'Login Sucessfully',
        user: user,
        token,
      };
    } catch (error) {
      throw error;
    }
  }
}
