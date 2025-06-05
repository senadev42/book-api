import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Books {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  author: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  coverImageUrl?: string;

  @ManyToOne(() => User, (user) => user.books)
  user: User;

  @Column({ type: 'uuid' })
  userId: string;
}
