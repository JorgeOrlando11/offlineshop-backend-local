import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  cost?: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  sku?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  needs_sync: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
