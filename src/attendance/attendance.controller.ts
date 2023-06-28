import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MarkAttendanceDto } from 'src/dto/attendance.dto';
import { AttendanceService } from './attendance.service';

@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/mark-attendance')
  async markAttendance(
    @Req() req: any,
    @Body() markAttendanceDto: MarkAttendanceDto,
  ) {
    return await this.attendanceService.markAttendance(markAttendanceDto, req);
  }
}
