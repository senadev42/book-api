import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookOwnedGuard } from './guards/book-owned.guard';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { GetBook } from './decorators/book.decorator';
import { Books } from './entities/book.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('books')
@ApiBearerAuth('JWT-Auth')
@UseGuards(JwtAuthGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @UseInterceptors(FileInterceptor('coverImage'))
  @ApiConsumes('multipart/form-data')
  create(
    @CurrentUser() user: User,
    @Body() createBookDto: CreateBookDto,
    @UploadedFile() coverImage?: Express.Multer.File,
  ) {
    return this.booksService.create(user.id, createBookDto, coverImage);
  }

  @Get()
  @ApiOperation({ summary: 'Get all books for the current user' })
  findAll(@CurrentUser() user: User) {
    return this.booksService.findAll(user.id);
  }

  @Get(':bookId')
  @UseGuards(BookOwnedGuard)
  @ApiParam({ name: 'bookId', type: 'string' })
  @ApiOperation({ summary: 'Get a specific book' })
  findOne(@Request() req) {
    return req.book;
  }

  @Patch(':bookId')
  @UseGuards(BookOwnedGuard)
  @ApiOperation({ summary: 'Update a book' })
  @ApiParam({ name: 'bookId', type: 'string' })
  @UseInterceptors(FileInterceptor('coverImage'))
  @ApiConsumes('multipart/form-data')
  update(
    @GetBook() book: Books,
    @Body() updateBookDto: UpdateBookDto,
    @UploadedFile() coverImage?: Express.Multer.File,
  ) {
    return this.booksService.update(book.id, updateBookDto, coverImage, book);
  }

  @Delete(':bookId')
  @UseGuards(BookOwnedGuard)
  @ApiOperation({ summary: 'Delete a book' })
  @ApiParam({ name: 'bookId', type: 'string' })
  remove(@GetBook() book: Books) {
    return this.booksService.remove(book.id, book);
  }
}
