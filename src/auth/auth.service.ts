import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserSignupInput } from './dto/user-signup.input';
import { LoginInput } from './dto/login.input';
import { OtpService } from './otp.service';
import { ResetPasswordInput } from './dto/reset-password.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
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

  async resetPassword(payload: ResetPasswordInput) {
    try {
      const verifyOtp = await this.otpService.otpUsed(payload.id);

      if (!verifyOtp) {
        throw new BadRequestException(
          'Cannot reset password for unverified user',
        );
      }
      const email = verifyOtp.email;

      if (payload.password !== payload.confirmPassword) {
        throw new ForbiddenException('Password not match');
      }

      payload.password = bcrypt.hashSync(payload.password, 8);
      await this.prisma.user.update({
        where: {
          email: email,
        },
        data: {
          password: payload.password,
        },
      });
      await this.otpService.delete(payload.id);
      return {
        message: 'Password reset successfully',
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new NotFoundException('User not found');
        }
      }
      throw error;
    }
  }
}
