import { Test, TestingModule } from '@nestjs/testing';
import { LoansService } from './loans.service';
import { LoansRepository } from './loans.repository';
import { CreateLoanDto, LoanResponseDto, PaginatedResultDto, PaginatedRequestDto } from '@finance-manager/dto';

describe('LoansService', () => {
  let service: LoansService;
  let loansRepository;

  const mockLoansRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    calculateAmortizationSchedule: jest.fn(),
  };

  const mockLoanResponse: LoanResponseDto = {
    id: 'loan-1',
    profileId: 'profile-1',
    amount: 1000000,
    interestRate: 500,
    startDate: new Date('2023-01-01'),
    endDate: new Date('2024-01-01'),
    type: 'personal',
    status: 'active',
    monthlyPayment: 85607,
    remainingBalance: 85607,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockPaginatedResult: PaginatedResultDto<LoanResponseDto> = {
    data: [mockLoanResponse],
    total: 1,
    page: 1,
    limit: 10,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoansService,
        {
          provide: LoansRepository,
          useValue: mockLoansRepository,
        },
      ],
    }).compile();

    service = module.get<LoansService>(LoansService);
    loansRepository = module.get(LoansRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new loan', async () => {
      const createDto: CreateLoanDto = {
        profileId: 'profile-1',
        amount: 1000000,
        interestRate: 500,
        startDate: new Date('2023-01-01'),
        endDate: new Date('2024-01-01'),
        type: 'personal',
        status: 'active',
        monthlyPayment: 85607,
        remainingBalance: 85607,
      };

      mockLoansRepository.create.mockResolvedValue(mockLoanResponse);

      const result = await service.create(createDto);

      expect(result).toBeDefined();
      expect(result.id).toBe('loan-1');
      expect(mockLoansRepository.create).toHaveBeenCalledWith(createDto);
    });

    it('should handle loan creation errors', async () => {
      const createDto: CreateLoanDto = {
        profileId: 'profile-1',
        amount: 1000000,
        interestRate: 500,
        startDate: new Date('2023-01-01'),
        endDate: new Date('2024-01-01'),
        type: 'personal',
        status: 'active',
        monthlyPayment: 85607,
        remainingBalance: 85607,
      };

      mockLoansRepository.create.mockRejectedValue(new Error('Creation failed'));

      await expect(service.create(createDto)).rejects.toThrow('Creation failed');
    });
  });

  describe('findAll', () => {
    it('should return paginated list of loans', async () => {
      const query: PaginatedRequestDto = {
        page: 1,
        limit: 10,
        search: '',
        sort: 'createdAt',
        order: 'DESC',
      };

      mockLoansRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll(query);

      expect(result).toBeDefined();
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(mockLoansRepository.findAll).toHaveBeenCalledWith(query);
    });

    it('should handle empty loan list', async () => {
      const query: PaginatedRequestDto = {
        page: 1,
        limit: 10,
        search: '',
        sort: 'createdAt',
        order: 'DESC',
      };

      const emptyResult: PaginatedResultDto<LoanResponseDto> = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      };

      mockLoansRepository.findAll.mockResolvedValue(emptyResult);

      const result = await service.findAll(query);

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return a single loan by id', async () => {
      mockLoansRepository.findOne.mockResolvedValue(mockLoanResponse);

      const result = await service.findOne('loan-1');

      expect(result).toBeDefined();
      expect(result.id).toBe('loan-1');
      expect(mockLoansRepository.findOne).toHaveBeenCalledWith('loan-1');
    });

    it('should return null when loan not found', async () => {
      mockLoansRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an existing loan', async () => {
      const updateDto: Partial<CreateLoanDto> = {
        status: 'paid',
        remainingBalance: 0,
      };

      const updatedResponse = { ...mockLoanResponse, ...updateDto };

      mockLoansRepository.update.mockResolvedValue(updatedResponse);

      const result = await service.update('loan-1', updateDto);

      expect(result).toBeDefined();
      expect(result.status).toBe('paid');
      expect(result.remainingBalance).toBe(0);
      expect(mockLoansRepository.update).toHaveBeenCalledWith('loan-1', updateDto);
    });

    it('should return null when loan not found', async () => {
      mockLoansRepository.update.mockResolvedValue(null);

      const result = await service.update('non-existent-id', { status: 'paid' });

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a loan', async () => {
      mockLoansRepository.remove.mockResolvedValue(undefined);

      await service.remove('loan-1');

      expect(mockLoansRepository.remove).toHaveBeenCalledWith('loan-1');
    });

    it('should handle delete errors gracefully', async () => {
      mockLoansRepository.remove.mockRejectedValue(new Error('Delete failed'));

      await expect(service.remove('loan-1')).rejects.toThrow('Delete failed');
    });
  });

  describe('calculateAmortizationSchedule', () => {
    it('should calculate amortization schedule for a loan', async () => {
      const mockSchedule = {
        paymentSchedule: [
          { paymentNumber: 1, paymentAmount: 85607, principal: 79167, interest: 6440, remainingBalance: 920833 },
          { paymentNumber: 2, paymentAmount: 85607, principal: 79542, interest: 6065, remainingBalance: 841291 },
        ],
        totalInterest: 12505,
        totalPayment: 171214,
      };

      mockLoansRepository.calculateAmortizationSchedule.mockResolvedValue(mockSchedule);

      const result = await service.calculateAmortizationSchedule('loan-1');

      expect(result).toBeDefined();
      expect(result.paymentSchedule).toBeDefined();
      expect(result.totalInterest).toBeDefined();
      expect(result.totalPayment).toBeDefined();
      expect(result.paymentSchedule).toHaveLength(2);
      expect(result.totalInterest).toBe(12505);
      expect(mockLoansRepository.calculateAmortizationSchedule).toHaveBeenCalledWith('loan-1');
    });

    it('should return null when loan not found', async () => {
      mockLoansRepository.calculateAmortizationSchedule.mockResolvedValue(null);

      const result = await service.calculateAmortizationSchedule('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle repository errors gracefully', async () => {
      mockLoansRepository.findAll.mockRejectedValue(new Error('Database error'));

      const query: PaginatedRequestDto = {
        page: 1,
        limit: 10,
        search: '',
        sort: 'createdAt',
        order: 'DESC',
      };

      await expect(service.findAll(query)).rejects.toThrow('Database error');
    });

    it('should handle invalid loan id', async () => {
      mockLoansRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne('invalid-id');

      expect(result).toBeNull();
    });
  });
});