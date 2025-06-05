import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Handles user registration.
   * @param registerDto
   * @returns
   */
  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersRepository.findOne({
      where: [{ email: registerDto.email }],
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Extract username from email if not provided
    const defaultUsername = registerDto.email.split('@')[0];
    const username = registerDto.username || defaultUsername;

    // Check if the username already exists
    const existingUsername = await this.usersRepository.findOne({
      where: { username },
    });

    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.usersRepository.create({
      email: registerDto.email,
      username,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    return this.generateAuthResponse(user);
  }

  /**
   * Handles user login.
   * @param loginDto
   * @returns
   */

  async login(loginDto: LoginDto) {
    // Check if the identifier is an email
    const isEmail = loginDto.identifier.includes('@');

    const user = await this.usersRepository.findOne({
      where: isEmail
        ? { email: loginDto.identifier }
        : { username: loginDto.identifier },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // bump last login time
    user.lastLoginAt = new Date();
    await this.usersRepository.save(user);

    return this.generateAuthResponse(user);
  }

  private generateAuthResponse(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }
}
