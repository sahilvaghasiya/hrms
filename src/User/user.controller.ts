import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:_id')
  async getUserById(@Param('_id') _id: string) {
    return await this.userService.getUserById(_id);
  }
}
