import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @ApiProperty({ example: 'The Great Gatsby' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'F. Scott Fitzgerald' })
  @IsNotEmpty()
  @IsString()
  author: string;

  @ApiPropertyOptional({
    example:
      'A novel that critiques the idea of the American Dream in the Jazz Age of the Roaring Twenties.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 1925 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  year: number;

  @ApiPropertyOptional({
    example:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg/500px-The_Great_Gatsby_Cover_1925_Retouched.jpg',
  })
  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Cover image file upload',
  })
  coverImage?: any;
}
