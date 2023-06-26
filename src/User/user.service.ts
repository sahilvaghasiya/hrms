import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import {
  ChangePasswordDto,
  CreateUserDto,
  LogInUserDto,
} from 'src/Dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private hashData(data: string) {
    return bcrypt.hash(data, 8);
  }

  async signUp(createUserDto: CreateUserDto) {
    const { email, password, name, role, phone, invitationToken, invitedBy } =
      createUserDto;
    const check = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (check.email == createUserDto.email) {
      throw new HttpException(
        'user already have account',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (role === Role.ADMIN) {
      const existingAdmin = await this.prisma.user.findFirst({
        where: {
          role: Role.ADMIN,
        },
      });
      if (existingAdmin) {
        throw new Error('Admin is already created');
      }
    }
    const hashPassword = await this.hashData(password);
    const user = await this.prisma.user.create({
      data: {
        invitedBy: invitedBy,
        invitationToken: invitationToken,
        email: email,
        role: role,
        name: name,
        phone: phone,
      },
    });
    await this.prisma.userCredential.create({
      data: {
        userId: user.id,
        password: hashPassword,
      },
    });
    return {
      user,
    };
  }

  async logIn(logInUserDto: LogInUserDto) {
    const { email, password } = logInUserDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.UNAUTHORIZED);
    }
    const userCredential = await this.prisma.userCredential.findFirst({
      where: {
        userId: user.id,
      },
    });
    const hashPassword = await bcrypt.compare(
      password,
      userCredential.password,
    );
    if (!hashPassword) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
    return {
      user,
    };
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { email, password, newPassword } = changePasswordDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.UNAUTHORIZED);
    }
    const credential = await this.prisma.userCredential.findFirst({
      where: {
        userId: user.id,
      },
    });
    const compare = await bcrypt.compare(password, credential.password);
    if (!compare) {
      throw new HttpException('invalid old password', HttpStatus.UNAUTHORIZED);
    }
    const hashPassword = await this.hashData(newPassword);
    await this.prisma.userCredential.update({
      where: {
        id: credential.id,
      },
      data: {
        password: hashPassword,
      },
    });
  }
}
