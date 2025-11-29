import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConflictException } from '@nestjs/common';

describe('UsersService', () => {
    let service: UsersService;
    let mockRepository;

    beforeEach(async () => {
        mockRepository = {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const createUserDto = {
                email: 'test@test.com',
                password: 'password',
                first_name: 'Test',
                last_name: 'User',
            };
            const savedUser = { id: '1', ...createUserDto, password_hash: 'hashed' };

            mockRepository.create.mockReturnValue(savedUser);
            mockRepository.save.mockResolvedValue(savedUser);

            const result = await service.create(createUserDto);
            expect(result).toEqual(savedUser);
            expect(mockRepository.create).toHaveBeenCalled();
            expect(mockRepository.save).toHaveBeenCalled();
        });

        it('should throw ConflictException on duplicate email', async () => {
            const createUserDto = {
                email: 'test@test.com',
                password: 'password',
                first_name: 'Test',
                last_name: 'User',
            };

            mockRepository.create.mockReturnValue(createUserDto);
            mockRepository.save.mockRejectedValue({ code: '23505' });

            await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
        });
    });
});
