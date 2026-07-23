import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TransactionType } from '@finance-manager/types';
import { Profile } from './Profile';
import { Business } from './Business';
import { Loan } from './Loan';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 30 })
  type: TransactionType;

  @Column({ type: 'integer' })
  amount: number; // in cents

  @Column({ type: 'date' })
  date: Date;

  @Column({ length: 50 })
  category: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Profile, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column({ nullable: true })
  profileId: string;

  @ManyToOne(() => Business, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @Column({ nullable: true })
  businessId: string;

  @ManyToOne(() => Loan, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'loan_id' })
  loan: Loan;

  @Column({ nullable: true })
  loanId: string;

  @Column({ default: false })
  isReconciled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}