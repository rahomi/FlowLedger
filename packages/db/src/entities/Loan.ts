import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LoanStatus } from '@finance-manager/types';
import { Profile } from './Profile';

@Entity()
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10 })
  type: 'given' | 'taken';

  @Column({ type: 'integer' })
  principalAmount: number; // in cents

  @Column({ type: 'integer', default: 0 })
  paidAmount: number; // in cents

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @ManyToOne(() => Profile, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'lender_profile_id' })
  lenderProfile: Profile;

  @Column({ nullable: true })
  lenderProfileId: string;

  @ManyToOne(() => Profile, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'borrower_profile_id' })
  borrowerProfile: Profile;

  @Column({ nullable: true })
  borrowerProfileId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 10, default: 'active' })
  status: LoanStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}