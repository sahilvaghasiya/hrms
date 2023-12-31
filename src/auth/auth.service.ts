import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  ChangePasswordDto,
  CreateUserDto,
  LogInUserDto,
} from 'src/dto/user.dto';
import { UserService } from 'src/user/user.service';

type ChangePasswordParams = {
  changePasswordDto: ChangePasswordDto;
  req: any;
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaClient,
    private jwt: JwtService,
    private userService: UserService,
  ) {}

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
    if (check && email === check.email) {
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
    const token = await this.signToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });
    return {
      user,
      token,
    };
  }

  async signToken(args: { id: string; email: string; name: string }) {
    const payload = args;
    return this.jwt.signAsync(payload, { secret: process.env.SECRETKEY });
  }

  async changePassword({ changePasswordDto, req }: ChangePasswordParams) {
    console.log('string', req);
    const user = await this.userService.getUserById(req.user.id);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.UNAUTHORIZED);
    }
    const { password, newPassword } = changePasswordDto;
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
    return user;
  }
}
