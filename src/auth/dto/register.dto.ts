import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'username123', required: false })
  username?: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ example: 'password' })
  password: string;
}
