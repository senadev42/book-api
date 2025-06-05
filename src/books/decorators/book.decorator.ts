import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Books } from '../entities/book.entity';

export const GetBook = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Books => {
    const request = ctx.switchToHttp().getRequest();
    return request.book;
  },
);
