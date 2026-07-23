import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from '@finance-manager/db';
import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';
import { LoansRepository } from './loans.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Loan])],
  controllers: [LoansController],
  providers: [LoansService, LoansRepository],
  exports: [LoansService],
})
export class LoansModule {}