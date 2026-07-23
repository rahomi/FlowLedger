import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { EntityType } from '@finance-manager/types';

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  fileName: string;

  @Column({ length: 500 })
  filePath: string;

  @Column({ length: 50 })
  fileType: string;

  @Column({ type: 'integer' })
  fileSize: number;

  @Column({ type: 'varchar', length: 20 })
  entityType: EntityType;

  @Column()
  entityId: string;

  @CreateDateColumn()
  createdAt: Date;
}