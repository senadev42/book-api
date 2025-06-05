import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Books } from './entities/book.entity';
import { BookOwnedGuard } from './guards/book-owned.guard';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Books]), StorageModule],
  controllers: [BooksController],
  providers: [BooksService, BookOwnedGuard],
})
export class BooksModule {}
