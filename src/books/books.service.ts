import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Books } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { StorageService } from '../storage/storage.service';
import { ConfigService } from '@nestjs/config';
import { STORAGE_CONFIG, StorageConfig } from 'src/config/storage.config';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Books)
    private booksRepository: Repository<Books>,
    private readonly storageService: StorageService, // Assuming StorageService is already defined and imported
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(BooksService.name);

  private readonly publicUrl: string =
    this.configService.get<StorageConfig>(STORAGE_CONFIG).publicUrl;

  private extractObjectKeyFromUrl(url: string, publicUrl: string): string {
    // Remove the public URL and leading slash to get just the object key
    return url.replace(`${publicUrl}/`, '');
  }

  /**
   * Creates a new book for the specified user.
   * @param userId
   * @param createBookDto
   * @returns The created book entity.
   */
  async create(
    userId: string,
    createBookDto: CreateBookDto,
    coverImage?: Express.Multer.File,
  ): Promise<Books> {
    try {
      // attempt to upload the cover image if provided
      if (coverImage) {
        try {
          createBookDto.coverImageUrl =
            await this.storageService.uploadFile(coverImage);
        } catch (uploadError) {
          this.logger.warn(
            `Failed to upload cover image, saving as is: ${uploadError.message}`,
            uploadError.stack,
          );
        }
      }

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
    coverImage?: Express.Multer.File,
    bookObject?: Books,
  ): Promise<Books> {
    try {
      let book = bookObject ?? (await this.findOne(bookId));

      if (coverImage) {
        try {
          // Delete old image if it exists
          if (book.coverImageUrl) {
            try {
              const oldImageKey = this.extractObjectKeyFromUrl(
                book.coverImageUrl,
                this.publicUrl,
              );
              await this.storageService.deleteFile(oldImageKey);
            } catch (deleteError) {
              this.logger.warn(
                `Failed to delete old cover image: ${deleteError.message}`,
                deleteError.stack,
              );
            }
          }

          // Upload new image
          updateBookDto.coverImageUrl =
            await this.storageService.uploadFile(coverImage);
        } catch (uploadError) {
          this.logger.warn(
            `Failed to update cover image: ${uploadError.message}`,
            uploadError.stack,
          );
        }
      }

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

      if (book.coverImageUrl) {
        try {
          const imageKey = this.extractObjectKeyFromUrl(
            book.coverImageUrl,
            this.publicUrl,
          );
          await this.storageService.deleteFile(imageKey);
        } catch (deleteError) {
          this.logger.warn(
            `Failed to delete cover image: ${deleteError.message}`,
            deleteError.stack,
          );
        }
      }
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
