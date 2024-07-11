import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Login } from './entities/login.entity';
import { Signup } from './entities/signup.entity';
import { UserSignupInput } from './dto/user-signup.input';
import { LoginInput } from './dto/login.input';
import { OtpService } from './otp.service';
import { SendOtpInput } from './dto/send-otp.input';
import { VerifyOtpInput } from './dto/verify-otp.input';
import { Otp } from './entities/otp.entity';
import { ResetPasswordInput } from './dto/reset-password.input';
import { ResendOtpInput } from './dto/resend-otp.input';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  @Mutation(() => Signup)
  signup(@Args('userSignupInput') userSignupInput: UserSignupInput) {
    return this.authService.signup(userSignupInput);
  }

  @Mutation(() => Login)
  login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => Otp)
  sendOtp(@Args('sendOtpInput') sendOtpInput: SendOtpInput) {
    return this.otpService.sendOtp(sendOtpInput);
  }

  @Mutation(() => Otp)
  verifyOtp(@Args('verifyOtpInput') verifyOtpInput: VerifyOtpInput) {
    return this.otpService.verifyOtp(verifyOtpInput);
  }

  @Query(() => Otp)
  resendOtp(@Args('resendOtpInput') resendOtpInput: ResendOtpInput) {
    return this.otpService.resendOtp(resendOtpInput);
  }

  @Mutation(() => Otp)
  resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
  ) {
    return this.authService.resetPassword(resetPasswordInput);
  }
}
