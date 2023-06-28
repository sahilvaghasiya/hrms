import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
// import { AttendanceModule } from './attendance/attendance.module';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LeaveService } from './leave/leave.service';
import { LeaveController } from './leave/leave.controller';
import { LeaveModule } from './leave/leave.module';

@Module({
  imports: [UserModule, AuthModule, AttendanceModule, LeaveModule],
  controllers: [AppController, LeaveController],
  providers: [AppService, LeaveService],
})
export class AppModule {}
