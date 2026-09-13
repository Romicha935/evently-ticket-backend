import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(registerDto: RegisterDto) {
    const { firstName, lastName, email, password } = registerDto;

    // Check existing user
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
  const user = await this.prisma.user.create({
  data: {
    firstName,
    lastName,
    email,
    password: hashedPassword,
  },
});

    // Never return password
    const { password: _, ...userWithoutPassword } = user;

    return {
      message: 'Registration successful',
      user: userWithoutPassword,
    };
  }
}