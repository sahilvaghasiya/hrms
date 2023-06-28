import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private hashData(data: string) {
    return bcrypt.hash(data, 8);
  }

  async getUserById(_id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: _id,
      },
    });
    return user;
  }
}
