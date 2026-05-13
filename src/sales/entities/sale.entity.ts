import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id: number;

  @Column('int')
  quantity: number;

  @Column('decimal')
  unit_price: number;

  @Column('decimal')
  total: number;

  @Column({ default: false })
  needs_sync: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}