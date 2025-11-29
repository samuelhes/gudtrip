import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    let service: AuthService;
    let mockUsersService;
    let mockJwtService;

    beforeEach(async () => {
        mockUsersService = {
            findOneByEmail: jest.fn(),
            create: jest.fn(),
        };
        mockJwtService = {
            sign: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: mockUsersService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('validateUser', () => {
        it('should return user data if password matches', async () => {
            const user = { email: 'test@test.com', password_hash: '$2b$10$hashed', id: '1' };
            mockUsersService.findOneByEmail.mockResolvedValue(user);
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

            const result = await service.validateUser('test@test.com', 'password');
            expect(result).toEqual({ email: 'test@test.com', id: '1' });
        });

        it('should return null if password does not match', async () => {
            const user = { email: 'test@test.com', password_hash: '$2b$10$hashed', id: '1' };
            mockUsersService.findOneByEmail.mockResolvedValue(user);
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

            const result = await service.validateUser('test@test.com', 'wrong');
            expect(result).toBeNull();
        });
    });

    describe('login', () => {
        it('should return access token', async () => {
            const user = { email: 'test@test.com', id: '1', roles: [] };
            jest.spyOn(service, 'validateUser').mockResolvedValue(user);
            mockJwtService.sign.mockReturnValue('token');

            const result = await service.login({ email: 'test@test.com', password: 'password' });
            expect(result).toEqual({ access_token: 'token', user });
        });
    });
});
