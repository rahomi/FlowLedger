import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, TransactionResponseDto, PaginatedResultDto } from '@finance-manager/dto';
import { PaginatedRequestDto } from '@finance-manager/dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto): Promise<TransactionResponseDto> {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  findAll(@Query() query: PaginatedRequestDto): Promise<PaginatedResultDto<TransactionResponseDto>> {
    return this.transactionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<TransactionResponseDto> {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: Partial<CreateTransactionDto>): Promise<TransactionResponseDto> {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.transactionsService.remove(id);
  }

  @Get('summary/:accountType/:accountId')
  getSummary(
    @Param('accountId') accountId: string,
    @Param('accountType') accountType: 'personal' | 'business'
  ): Promise<any> {
    return this.transactionsService.getSummary(accountId, accountType);
  }
}