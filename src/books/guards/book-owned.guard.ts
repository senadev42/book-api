import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Books } from '../entities/book.entity';

@Injectable()
export class BookOwnedGuard implements CanActivate {
  constructor(
    @InjectRepository(Books)
    private booksRepository: Repository<Books>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const bookId = request.params.bookId;

    const book = await this.booksRepository.findOne({
      where: { id: bookId, userId: userId },
    });

    // We don't specify if the book didn't actually exists
    // or if it exists but doesn't belong to the user,
    // we just throw a NotFoundException
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // Attach book to request for later use
    request.book = book;
    return true;
  }
}
