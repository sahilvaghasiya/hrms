import { ApiProperty } from '@nestjs/swagger/dist';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'enter password in proper way',
    },
  )
  @MaxLength(8, { message: 'password is required 8 char long' })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(10, { message: 'enter proper number' })
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsIn(['ADMIN', 'MANAGER', 'EMPLOYEE'])
  role: Role;

  @ApiProperty()
  @IsOptional()
  @IsString()
  invitedBy?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  invitationToken?: string;
}

export class LogInUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'enter password in proper way',
    },
  )
  @MaxLength(8, { message: 'password is required 8 char long' })
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'enter password in proper way',
    },
  )
  @MaxLength(8, { message: 'password is required 8 char long' })
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'enter password in proper way',
    },
  )
  @MaxLength(8, { message: 'password is required 8 char long' })
  newPassword: string;
}
