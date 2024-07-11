import { MailerService } from '@nestjs-modules/mailer';
import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { generateSixDigitCode, generateExpireTime } from 'src/utils/helper';
import { SendOtpInput } from './dto/send-otp.input';
import { VerifyOtpInput } from './dto/verify-otp.input';
import { ResendOtpInput } from './dto/resend-otp.input';
import { Prisma } from '@prisma/client';

@Injectable()
export class OtpService {
  constructor(
    private readonly prisma: PrismaService,
    private mailService: MailerService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}
  async findByEmail(email: string) {
    return await this.prisma.otp.findFirst({
      where: {
        email: email,
      },
    });
  }
  async findById(id: string) {
    console.log(id);

    const otp = await this.prisma.otp.findUnique({
      where: {
        id: id,
      },
    });
    if (!otp) {
      throw new ForbiddenException('Not Found');
    }
    return otp;
  }

  async otpUsed(id: string) {
    return await this.prisma.otp.findFirst({
      where: {
        id: id,
        isUsed: true,
      },
    });
  }

  async sendOtp(payload: SendOtpInput) {
    try {
      const user = await this.userService.findByEmail(payload.email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const otp = generateSixDigitCode();
      const otpExpireTime = generateExpireTime();

      const existingUserOtp = await this.findByEmail(payload.email);
      if (existingUserOtp?.email) {
        const update = await this.prisma.otp.update({
          where: {
            id: existingUserOtp.id,
          },
          data: {
            code: otp,
            isUsed: false,
            isExpired: false,
            expireTime: otpExpireTime,
          },
        });

        await this.sendEmail({ ...payload, otp });

        const { code, isUsed, createdAt, isExpired, expireTime, ...rest } =
          update;
        const userdata = { ...rest };
        console.log(userdata);

        return {
          message: 'OTP sent scuccessfully',
          user: userdata,
        };
      } else {
        const newUserOtp = await this.prisma.otp.create({
          data: {
            ...payload,
            code: otp,
            expireTime: otpExpireTime,
          },
        });

        await this.sendEmail({ ...payload, otp });

        const { code, isUsed, createdAt, isExpired, expireTime, ...rest } =
          newUserOtp;
        const userdata = { ...rest };
        return {
          message: 'OTP sent scuccessfully',
          user: userdata,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp(payload: VerifyOtpInput) {
    try {
      const nowTime = new Date();
      const expirationTime = nowTime.toTimeString().slice(0, 8);
      const existingUserOtp = await this.findById(payload.id);
      const user = await this.prisma.user.findUnique({
        where: {
          email: existingUserOtp.email,
        },
      });

      if (user.isVerify == false) {
        if (existingUserOtp.isUsed == true) {
          throw new ForbiddenException('OTP is already used');
        }

        if (existingUserOtp.code !== payload.code) {
          throw new NotAcceptableException('OTP is invalid');
        }

        if (existingUserOtp.expireTime <= expirationTime) {
          throw new ForbiddenException('OTP is Expired');
        }
        await this.userService.verifyUser(user.email);
        await this.prisma.otp.update({
          where: {
            id: payload.id,
            code: payload.code,
          },
          data: {
            isUsed: true,
            isExpired: true,
          },
        });

        return {
          message: 'Verification Successfull',
        };
      } else {
        if (existingUserOtp.isUsed == true) {
          throw new ForbiddenException('OTP is already used');
        }
        if (existingUserOtp.code !== payload.code) {
          throw new NotAcceptableException('OTP is invalid');
        }
        if (existingUserOtp.expireTime <= expirationTime) {
          throw new ForbiddenException('OTP is Expired');
        }
        await this.prisma.otp.update({
          where: {
            id: payload.id,
            code: payload.code,
          },
          data: {
            isUsed: true,
            isExpired: true,
          },
        });

        return {
          message: 'Verification Successfull',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async sendEmail(data) {
    try {
      console.log(data);

      let mailOptions: any = {
        to: data.email,
        from: this.configService.get<string>('EMAIL_HOST_USER'),
        subject: 'OTP Request',
        template: './emailVerification',
        context: {
          data: { ...data },
        },
      };

      await this.mailService.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }

  async resendOtp(payload: ResendOtpInput) {
    try {
      const otpExpireTime = generateExpireTime();
      const existingUserOtp = await this.findById(payload.id);
      const email = existingUserOtp.email;
      if (!existingUserOtp) {
        throw new NotFoundException('User Not Found');
      }
      const otp = generateSixDigitCode();

      await this.sendEmail({ email, otp });

      const data = await this.prisma.otp.update({
        where: {
          id: existingUserOtp.id,
        },
        data: {
          code: otp,
          isExpired: false,
          isUsed: false,
          expireTime: otpExpireTime,
        },
      });

      await this.sendEmail({ email, otp });

      const { code, isUsed, createdAt, isExpired, expireTime, ...rest } = data;
      const userdata = { ...rest };
      return {
        message: 'OTP sent successfully',
        user: userdata,
      };
    } catch (error) {
      throw error;
    }
  }
  async delete(id: string) {
    try {
      return await this.prisma.otp.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }
}
