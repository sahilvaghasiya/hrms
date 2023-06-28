import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ChangePasswordDto,
  CreateUserDto,
  LogInUserDto,
} from 'src/dto/user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @Post('/log-in')
  async logIn(@Body() logInUserDto: LogInUserDto) {
    return await this.authService.logIn(logInUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('/change-password')
  async changePassword(
    @Req() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.authService.changePassword({
      req,
      changePasswordDto,
    });
  }
}
