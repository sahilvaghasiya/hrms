import { Body, Controller, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ChangePasswordDto,
  CreateUserDto,
  LogInUserDto,
} from 'src/Dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/sign-up')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.userService.signUp(createUserDto);
  }

  @Post('/log-in')
  async logIn(@Body() logInUserDto: LogInUserDto) {
    return await this.userService.logIn(logInUserDto);
  }

  @Put('/change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return await this.userService.changePassword(changePasswordDto);
  }
}
