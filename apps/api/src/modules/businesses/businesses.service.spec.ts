import { Test, TestingModule } from '@nestjs/testing';
import { BusinessesService } from './businesses.service';
import { BusinessesRepository } from './businesses.repository';
import { CreateBusinessDto, BusinessResponseDto, PaginatedResultDto, PaginatedRequestDto } from '@finance-manager/dto';

describe('BusinessesService', () => {
  let service: BusinessesService;
  let businessesRepository;

  const mockBusinessesRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getSummary: jest.fn(),
  };

  const mockBusinessResponse: BusinessResponseDto = {
    id: 'business-1',
    profileId: 'profile-1',
    name: 'Acme Corp',
    industry: 'Technology',
    businessType: 'LLC',
    taxId: '123456789',
    foundedDate: new Date('2020-01-01'),
    annualRevenue: 1000000,
    employeesCount: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockPaginatedResult: PaginatedResultDto<BusinessResponseDto> = {
    data: [mockBusinessResponse],
    total: 1,
    page: 1,
    limit: 10,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessesService,
        {
          provide: BusinessesRepository,
          useValue: mockBusinessesRepository,
        },
      ],
    }).compile();

    service = module.get<BusinessesService>(BusinessesService);
    businessesRepository = module.get(BusinessesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new business', async () => {
      const createDto: CreateBusinessDto = {
        profileId: 'profile-1',
        name: 'Acme Corp',
        industry: 'Technology',
        businessType: 'LLC',
        taxId: '123456789',
        foundedDate: new Date('2020-01-01'),
        annualRevenue: 1000000,
        employeesCount: 10,
      };

      mockBusinessesRepository.create.mockResolvedValue(mockBusinessResponse);

      const result = await service.create(createDto);

      expect(result).toBeDefined();
      expect(result.id).toBe('business-1');
      expect(mockBusinessesRepository.create).toHaveBeenCalledWith(createDto);
    });

    it('should handle business creation errors', async () => {
      const createDto: CreateBusinessDto = {
        profileId: 'profile-1',
        name: 'Acme Corp',
        industry: 'Technology',
        businessType: 'LLC',
        taxId: '123456789',
        foundedDate: new Date('2020-01-01'),
        annualRevenue: 1000000,
        employeesCount: 10,
      };

      mockBusinessesRepository.create.mockRejectedValue(new Error('Creation failed'));

      await expect(service.create(createDto)).rejects.toThrow('Creation failed');
    });
  });

  describe('findAll', () => {
    it('should return paginated list of businesses', async () => {
      const query: PaginatedRequestDto = {
        page: 1,
        limit: 10,
        search: '',
        sort: 'createdAt',
        order: 'DESC',
      };

      mockBusinessesRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll(query);

      expect(result).toBeDefined();
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(mockBusinessesRepository.findAll).toHaveBeenCalledWith(query);
    });

    it('should handle empty business list', async () => {
      const query: PaginatedRequestDto = {
        page: 1,
        limit: 10,
        search: '',
        sort: 'createdAt',
        order: 'DESC',
      };

      const emptyResult: PaginatedResultDto<BusinessResponseDto> = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      };

      mockBusinessesRepository.findAll.mockResolvedValue(emptyResult);

      const result = await service.findAll(query);

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return a single business by id', async () => {
      mockBusinessesRepository.findOne.mockResolvedValue(mockBusinessResponse);

      const result = await service.findOne('business-1');

      expect(result).toBeDefined();
      expect(result.id).toBe('business-1');
      expect(mockBusinessesRepository.findOne).toHaveBeenCalledWith('business-1');
    });

    it('should return null when business not found', async () => {
      mockBusinessesRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an existing business', async () => {
      const updateDto: Partial<CreateBusinessDto> = {
        annualRevenue: 1200000,
        employeesCount: 15,
      };

      const updatedResponse = { ...mockBusinessResponse, ...updateDto };

      mockBusinessesRepository.update.mockResolvedValue(updatedResponse);

      const result = await service.update('business-1', updateDto);

      expect(result).toBeDefined();
      expect(result.annualRevenue).toBe(1200000);
      expect(result.employeesCount).toBe(15);
      expect(mockBusinessesRepository.update).toHaveBeenCalledWith('business-1', updateDto);
    });

    it('should return null when business not found', async () => {
      mockBusinessesRepository.update.mockResolvedValue(null);

      const result = await service.update('non-existent-id', { annualRevenue: 1000000 });

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a business', async () => {
      mockBusinessesRepository.remove.mockResolvedValue(undefined);

      await service.remove('business-1');

      expect(mockBusinessesRepository.remove).toHaveBeenCalledWith('business-1');
    });

    it('should handle delete errors gracefully', async () => {
      mockBusinessesRepository.remove.mockRejectedValue(new Error('Delete failed'));

      await expect(service.remove('business-1')).rejects.toThrow('Delete failed');
    });
  });

  describe('getSummary', () => {
    it('should return business summary', async () => {
      const mockSummary = {
        totalRevenue: 1000000,
        totalExpenses: 400000,
        netProfit: 600000,
        profitMargin: 60,
        transactionsCount: 50,
        loansCount: 2,
      };

      mockBusinessesRepository.getSummary.mockResolvedValue(mockSummary);

      const result = await service.getSummary('business-1');

      expect(result).toBeDefined();
      expect(result.totalRevenue).toBe(1000000);
      expect(result.totalExpenses).toBe(400000);
      expect(result.netProfit).toBe(600000);
      expect(result.profitMargin).toBe(60);
      expect(mockBusinessesRepository.getSummary).toHaveBeenCalledWith('business-1');
    });

    it('should handle empty summary', async () => {
      const mockSummary = {
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        profitMargin: 0,
        transactionsCount: 0,
        loansCount: 0,
      };

      mockBusinessesRepository.getSummary.mockResolvedValue(mockSummary);

      const result = await service.getSummary('business-1');

      expect(result.totalRevenue).toBe(0);
      expect(result.totalExpenses).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle repository errors gracefully', async () => {
      mockBusinessesRepository.findAll.mockRejectedValue(new Error('Database error'));

      const query: PaginatedRequestDto = {
        page: 1,
        limit: 10,
        search: '',
        sort: 'createdAt',
        order: 'DESC',
      };

      await expect(service.findAll(query)).rejects.toThrow('Database error');
    });

    it('should handle invalid business id', async () => {
      mockBusinessesRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne('invalid-id');

      expect(result).toBeNull();
    });
  });
});