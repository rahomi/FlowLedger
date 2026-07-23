import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalAccount } from '@finance-manager/db';
import { PersonalController } from './personal.controller';
import { PersonalService } from './personal.service';
import { PersonalRepository } from './personal.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PersonalAccount])],
  controllers: [PersonalController],
  providers: [PersonalService, PersonalRepository],
  exports: [PersonalService],
})
export class PersonalModule {}