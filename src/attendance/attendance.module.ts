import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { UserService } from 'src/user/user.service';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [PrismaModule, UserModule],
  providers: [AttendanceService, UserService, PrismaClient],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
