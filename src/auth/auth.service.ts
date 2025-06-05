import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { AuthResponse } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  /**
   * Handles user registration.
   * @param registerDto
   * @returns
   */
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    //VALIDATE
    const existingUser = await this.usersRepository.findOne({
      where: [{ email: registerDto.email }],
    });

    if (existingUser) {
      this.logger.warn(
        `Registration attempted with existing email: ${registerDto.email}`,
      );
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
      this.logger.warn(
        `Registration attempted with existing username: ${username}`,
      );
      throw new ConflictException('Username already exists');
    }

    // STORE
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

  async login(loginDto: LoginDto): Promise<AuthResponse> {
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

  private generateAuthResponse(user: User): AuthResponse {
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
