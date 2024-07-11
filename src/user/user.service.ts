import { ForbiddenException, Injectable } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { UserSignupInput } from 'src/auth/dto/user-signup.input';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: UserSignupInput) {
    const user = await this.prisma.user.create({
      data: {
        ...payload,
        address: {
          create: {
            ...payload.address,
          },
        },
      },
      include: {
        address: true,
      },
    });
    return user;
  }

  async getUsers() {
    return await this.prisma.user.findMany();
  }

  async deleteUser(user: User) {
    try {
      const date = new Date().toISOString();
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          email: `${date}${user.email}`,
          isDelete: true,
        },
      });
      return {
        message: 'Account delete successfully',
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2025') {
          throw new ForbiddenException('Not Found');
        }
      }
    }
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      include: { address: true },
    });
  }

  async findByEmail(email: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId: string, payload: UpdateUserInput) {
    try {
      const dataToUpdate: any = {
        name: payload.name,
        phoneNumber: payload.phoneNumber,
        imageUrl: payload.imageUrl,
        role: payload.role,
      };

      if (payload.address) {
        const existingAddress = await this.prisma.userAddress.findUnique({
          where: { userId: userId },
        });

        if (existingAddress) {
          dataToUpdate.address = {
            update: {
              longitude: payload.address.longitude,
              latitude: payload.address.latitude,
              city: payload.address.city,
              state: payload.address.state,
              country: payload.address.country,
              address: payload.address.address,
            },
          };
        } else {
          dataToUpdate.address = {
            connectOrCreate: {
              where: {
                userId: userId,
              },
              create: {
                longitude: payload.address.longitude,
                latitude: payload.address.latitude,
                city: payload.address.city,
                state: payload.address.state,
                country: payload.address.country,
                address: payload.address.address,
              },
            },
          };
        }
      }

      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...dataToUpdate,
        },
        include: {
          address: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2025') {
          throw new ForbiddenException('Not Found');
        }
      }
      throw error;
    }
  }

  async verifyUser(email: string) {
    try {
      await this.findByEmail(email);
      return await this.prisma.user.update({
        where: {
          email,
        },
        data: {
          isVerify: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
