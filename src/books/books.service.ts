import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Books } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Books)
    private booksRepository: Repository<Books>,
  ) {}

  private readonly logger = new Logger(BooksService.name);

  /**
   * Creates a new book for the specified user.
   * @param userId
   * @param createBookDto
   * @returns The created book entity.
   */
  async create(userId: string, createBookDto: CreateBookDto): Promise<Books> {
    try {
      const book = this.booksRepository.create({
        ...createBookDto,
        userId,
      });
      const savedBook = await this.booksRepository.save(book);

      return savedBook;
    } catch (error) {
      this.logger.error(
        `Failed to create book for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Finds all books for a specific user.
   * @param userId
   * @returns A list of books belonging to the user.
   */
  async findAll(userId: string): Promise<Books[]> {
    try {
      const books = await this.booksRepository.find({
        where: { userId },
      });

      return books;
    } catch (error) {
      this.logger.error(
        `Failed to fetch books for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(bookId: string): Promise<Books> {
    try {
      const book = await this.booksRepository.findOne({
        where: { id: bookId },
      });

      return book;
    } catch (error) {
      this.logger.error(
        `Failed to fetch book ${bookId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Updates a book by its ID for a specific user.
   * @param book - The book entity to update.
   * @param updateBookDto
   * @returns Updated book entity
   */
  async update(
    bookId: string,
    updateBookDto: UpdateBookDto,
    bookObject?: Books,
  ): Promise<Books> {
    try {
      let book = bookObject ?? (await this.findOne(bookId));

      const updatedBook = Object.assign(book, updateBookDto);
      const savedBook = await this.booksRepository.save(updatedBook);

      return savedBook;
    } catch (error) {
      this.logger.error(
        `Failed to update book ${bookId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Removes a book by its ID, or if the entity is provided, removes it directly
   * @param book
   * @param userId
   */
  async remove(bookId: string, bookObject?: Books): Promise<void> {
    try {
      let book = bookObject ?? (await this.findOne(bookId));
      await this.booksRepository.remove(book);
    } catch (error) {
      this.logger.error(
        `Failed to delete book ${bookId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
