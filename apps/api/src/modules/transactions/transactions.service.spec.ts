import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';
import { CreateTransactionDto, TransactionResponseDto, PaginatedResultDto, PaginatedRequestDto } from '@finance-manager/dto';
import { TransactionType } from '@finance-manager/types';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionsRepository;

  const mockTransactionsRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getSummary: jest.fn(),
  };

  const mockTransactionResponse: TransactionResponseDto = {
    id: 'txn-1',
    profileId: 'profile-1',
    amount: 50000,
    type: TransactionType.Income,
    category: 'Salary',
    date: '2024-01-15',
    description: 'Monthly salary',
    isReconciled: false,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    deletedAt: undefined,
  };

  const mockPaginatedResult: PaginatedResultDto<TransactionResponseDto> = {
    items: [mockTransactionResponse],
    total: 1,
    page: 1,
    limit: 10,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionsRepository,
          useValue: mockTransactionsRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionsRepository = module.get(TransactionsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const createDto: CreateTransactionDto = {
        profileId: 'profile-1',
        amount: 50000,
        type: TransactionType.Income,
        category: 'Salary',
        date: '2024-01-15',
        description: 'Monthly salary',
      };

      mockTransactionsRepository.create.mockResolvedValue(mockTransactionResponse);

      const result = await service.create(createDto);

      expect(result).toBeDefined();
      expect(result.id).toBe('txn-1');
      expect(mockTransactionsRepository.create).toHaveBeenCalledWith(createDto);
    });

    it('should handle transaction creation errors', async () => {
      const createDto: CreateTransactionDto = {
        profileId: 'profile-1',
        amount: 50000,
        type: TransactionType.Income,
        category: 'Salary',
        date: '2024-01-15',
        description: 'Monthly salary',
      };

      mockTransactionsRepository.create.mockRejectedValue(new Error('Creation failed'));

      await expect(service.create(createDto)).rejects.toThrow('Creation failed');
    });
  });

  describe('findAll', () => {
    it('should return paginated list of transactions', async () => {
      const query: PaginatedRequestDto = {
        page: 1,
        limit: 10,
        sort: 'createdAt',
      };

      mockTransactionsRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll(query);

      expect(result).toBeDefined();
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(mockTransactionsRepository.findAll).toHaveBeenCalledWith(query);
    });

    it('should handle empty transaction list', async () => {
      const query: PaginatedRequestDto = {
        page: 1,
        limit: 10,
        sort: 'createdAt',
      };

      const emptyResult: PaginatedResultDto<TransactionResponseDto> = {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
      };

      mockTransactionsRepository.findAll.mockResolvedValue(emptyResult);

      const result = await service.findAll(query);

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return a single transaction by id', async () => {
      mockTransactionsRepository.findOne.mockResolvedValue(mockTransactionResponse);

      const result = await service.findOne('txn-1');

      expect(result).toBeDefined();
      expect(result.id).toBe('txn-1');
      expect(mockTransactionsRepository.findOne).toHaveBeenCalledWith('txn-1');
    });

    it('should return null when transaction not found', async () => {
      mockTransactionsRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an existing transaction', async () => {
      const updateDto: Partial<CreateTransactionDto> = {
        description: 'Updated salary with bonus',
        amount: 55000,
      };

      const updatedResponse = { ...mockTransactionResponse, ...updateDto };

      mockTransactionsRepository.update.mockResolvedValue(updatedResponse);

      const result = await service.update('txn-1', updateDto);

      expect(result).toBeDefined();
      expect(result.description).toBe('Updated salary with bonus');
      expect(result.amount).toBe(55000);
      expect(mockTransactionsRepository.update).toHaveBeenCalledWith('txn-1', updateDto);
    });

    it('should return null when transaction not found', async () => {
      mockTransactionsRepository.update.mockResolvedValue(null);

      const result = await service.update('non-existent-id', { description: 'Test' });

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a transaction', async () => {
      mockTransactionsRepository.remove.mockResolvedValue(undefined);

      await service.remove('txn-1');

      expect(mockTransactionsRepository.remove).toHaveBeenCalledWith('txn-1');
    });

    it('should handle delete errors gracefully', async () => {
      mockTransactionsRepository.remove.mockRejectedValue(new Error('Delete failed'));

      await expect(service.remove('txn-1')).rejects.toThrow('Delete failed');
    });
  });

  describe('getSummary', () => {
    it('should return transaction summary for account', async () => {
      const mockSummary = {
        totalIncome: 150000,
        totalExpenses: 50000,
        netBalance: 100000,
        transactionsCount: 10,
      };

      mockTransactionsRepository.getSummary.mockResolvedValue(mockSummary);

      const result = await service.getSummary('profile-1', 'personal');

      expect(result).toBeDefined();
      expect(result.totalIncome).toBe(150000);
      expect(result.totalExpenses).toBe(50000);
      expect(result.netBalance).toBe(100000);
      expect(mockTransactionsRepository.getSummary).toHaveBeenCalledWith('profile-1', 'personal');
    });

    it('should handle empty summary', async () => {
      const mockSummary = {
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0,
        transactionsCount: 0,
      };

      mockTransactionsRepository.getSummary.mockResolvedValue(mockSummary);

      const result = await service.getSummary('profile-1', 'business');

      expect(result.totalIncome).toBe(0);
      expect(result.totalExpenses).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle repository errors gracefully', async () => {
      mockTransactionsRepository.findAll.mockRejectedValue(new Error('Database error'));

      const query: PaginatedRequestDto = {
        page: 1,
        limit: 10,
        sort: 'createdAt',
      };

      await expect(service.findAll(query)).rejects.toThrow('Database error');
    });

    it('should handle invalid transaction id', async () => {
      mockTransactionsRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne('invalid-id');

      expect(result).toBeNull();
    });
  });
});