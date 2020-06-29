import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import Category from './Category';

@Entity({ name: 'transactions' })
class Transaction {
  @PrimaryGeneratedColumn({ type: 'uuid' })
  id: string;

  @Column()
  title: string;

  @Column({ type: 'enum' })
  type: 'income' | 'outcome';

  @Column({ type: 'decimal' })
  value: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  category_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;
