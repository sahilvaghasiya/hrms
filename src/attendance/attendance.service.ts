import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as moment from 'moment';
import { MarkAttendanceDto } from 'src/dto/attendance.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaClient, private userService: UserService) {}

  async markAttendance(markAttendanceDto: MarkAttendanceDto, req: any) {
    const checkUser = await this.userService.getUserById(req.user.id);
    if (!checkUser) {
      throw new HttpException('user not found', HttpStatus.UNAUTHORIZED);
    }
    const { signInTime, signOutTime, date } = markAttendanceDto;
    const isoSignInTime = moment(signInTime, 'h:mm A').toISOString();
    const isoSignOutTime = moment(signOutTime, 'h:mm A').toISOString();
    const isoDate = moment(date, 'DD-MM-YYYY').toISOString();
    const totalHours = calculateTotalHours(
      new Date(signInTime),
      new Date(signOutTime),
    );
    function calculateTotalHours(signInTime: Date, signOutTime: Date) {
      const diffInMilliseconds = signOutTime.getTime() - signInTime.getTime();
      const totalMinutes = Math.floor(diffInMilliseconds / 60000);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours} hours ${minutes} minutes`;
    }
    const attendance = await this.prisma.attendance.create({
      data: {
        userId: checkUser.id,
        date: isoDate,
        signInTime: isoSignInTime,
        signOutTime: isoSignOutTime,
        totalHours: totalHours,
      },
    });
    return attendance;
  }
}
