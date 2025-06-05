import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Books } from './entities/book.entity';
import { BookOwnedGuard } from './guards/book-owned.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Books])],
  controllers: [BooksController],
  providers: [BooksService, BookOwnedGuard],
})
export class BooksModule {}
