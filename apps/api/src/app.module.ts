import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { PersonalModule } from './modules/personal/personal.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { LoansModule } from './modules/loans/loans.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { ReportsModule } from './modules/reports/reports.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_NAME', 'finance_manager'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
        ssl: configService.get('DB_SSL') === 'true'
      })
    }),
    BusinessesModule,
    PersonalModule,
    ProfilesModule,
    TransactionsModule,
    LoansModule,
    AttachmentsModule,
    ReportsModule,
    DashboardModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}