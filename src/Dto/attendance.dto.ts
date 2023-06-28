import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class MarkAttendanceDto {
  @ApiProperty()
  @IsISO8601()
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty()
  @IsISO8601()
  @IsNotEmpty()
  @IsString()
  signInTime: string;

  @ApiProperty()
  @IsISO8601()
  @IsNotEmpty()
  @IsString()
  signOutTime: string;
}
