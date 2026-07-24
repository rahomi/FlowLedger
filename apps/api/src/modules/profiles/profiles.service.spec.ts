import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { ProfilesRepository } from './profiles.repository';
import { CreateProfileDto, ProfileResponseDto, PaginatedResultDto, PaginatedRequestDto } from '@finance-manager/dto';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let profilesRepository;

  const mockProfilesRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockProfileResponse: ProfileResponseDto = {
    id: 'profile-1',
    userId: 'user-1',
    type: 'personal',
    name: 'John Doe',
    phone: '1234567890',
    email: 'john@example.com',
    address: '123 Main St',
    description: 'Personal profile',
    notes: 'Test profile',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockPaginatedResult: PaginatedResultDto<ProfileResponseDto> = {
    data: [mockProfileResponse],
    total: 1,
    page: 1,
    limit: 10,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: ProfilesRepository,
          useValue: mockProfilesRepository,
        },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
    profilesRepository = module.get(ProfilesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new profile', async () => {
      const createDto: CreateProfileDto = {
        userId: 'user-1',
        type: 'personal',
        name: 'John Doe',
        phone: '1234567890',
        email: 'john@example.com',
        address: '123 Main St',
        description: 'Personal profile',
        notes: 'Test profile',
      };

      mockProfilesRepository.create.mockResolvedValue(mockProfileResponse);

      const result = await service.create(createDto);

      expect(result).toBeDefined();
      expect(result.id).toBe('profile-1');
      expect(mockProfilesRepository.create).toHaveBeenCalledWith(createDto);
    });

    it('should handle profile creation errors', async () => {
      const createDto: CreateProfileDto = {
        userId: 'user-1',
        type: 'personal',
        name: 'John Doe',
        phone: '1234567890',
        email: 'john@example.com',
        address: '123 Main St',
        description: 'Personal profile',
        notes: 'Test profile',
      };

      mockProfilesRepository.create.mockRejectedValue(new Error('Creation failed'));

      await expect(service.create(createDto)).rejects.toThrow('Creation failed');
    });
  });

  describe('findAll', () => {
    it('should return paginated list of profiles', async () => {
      const query: PaginatedRequestDto = {
        page: 1,
        limit: 10,
        search: '',
        sort: 'createdAt',
        order: 'DESC',
      };

      mockProfilesRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll(query);

      expect(result).toBeDefined();
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(mockProfilesRepository.findAll).toHaveBeenCalledWith(query);
    });

    it('should handle empty profile list', async () => {
      const query: PaginatedRequestDto = {
        page: 1,
        limit: 10,
        search: '',
        sort: 'createdAt',
        order: 'DESC',
      };

      const emptyResult: PaginatedResultDto<ProfileResponseDto> = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      };

      mockProfilesRepository.findAll.mockResolvedValue(emptyResult);

      const result = await service.findAll(query);

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return a single profile by id', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(mockProfileResponse);

      const result = await service.findOne('profile-1');

      expect(result).toBeDefined();
      expect(result.id).toBe('profile-1');
      expect(mockProfilesRepository.findOne).toHaveBeenCalledWith('profile-1');
    });

    it('should return null when profile not found', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an existing profile', async () => {
      const updateDto: Partial<CreateProfileDto> = {
        phone: '9876543210',
        address: '456 Updated St',
      };

      const updatedResponse = { ...mockProfileResponse, ...updateDto };

      mockProfilesRepository.update.mockResolvedValue(updatedResponse);

      const result = await service.update('profile-1', updateDto);

      expect(result).toBeDefined();
      expect(result.phone).toBe('9876543210');
      expect(result.address).toBe('456 Updated St');
      expect(mockProfilesRepository.update).toHaveBeenCalledWith('profile-1', updateDto);
    });

    it('should return null when profile not found', async () => {
      mockProfilesRepository.update.mockResolvedValue(null);

      const result = await service.update('non-existent-id', { phone: '1234567890' });

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a profile', async () => {
      mockProfilesRepository.remove.mockResolvedValue(undefined);

      await service.remove('profile-1');

      expect(mockProfilesRepository.remove).toHaveBeenCalledWith('profile-1');
    });

    it('should handle delete errors gracefully', async () => {
      mockProfilesRepository.remove.mockRejectedValue(new Error('Delete failed'));

      await expect(service.remove('profile-1')).rejects.toThrow('Delete failed');
    });
  });

  describe('Error Handling', () => {
    it('should handle repository errors gracefully', async () => {
      mockProfilesRepository.findAll.mockRejectedValue(new Error('Database error'));

      const query: PaginatedRequestDto = {
        page: 1,
        limit: 10,
        search: '',
        sort: 'createdAt',
        order: 'DESC',
      };

      await expect(service.findAll(query)).rejects.toThrow('Database error');
    });

    it('should handle invalid profile id', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne('invalid-id');

      expect(result).toBeNull();
    });
  });
});