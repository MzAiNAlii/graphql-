import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtGuard } from 'src/auth/guard/jwt-guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [EventResolver, EventService, JwtGuard],
  exports: [EventService],
})
export class EventModule {}
