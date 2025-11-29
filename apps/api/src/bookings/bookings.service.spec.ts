import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { DataSource } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { WalletService } from '../wallet/wallet.service';
import { Ride, RideStatus } from '../rides/entities/ride.entity';
import { User } from '../users/entities/user.entity';

describe('BookingsService', () => {
    let service: BookingsService;
    let mockDataSource;
    let mockQueryRunner;

    beforeEach(async () => {
        mockQueryRunner = {
            connect: jest.fn(),
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
            manager: {
                findOne: jest.fn(),
                create: jest.fn(),
                save: jest.fn(),
            },
        };

        mockDataSource = {
            createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookingsService,
                {
                    provide: getRepositoryToken(Booking),
                    useValue: {},
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource,
                },
                {
                    provide: NotificationsService,
                    useValue: { sendBookingConfirmation: jest.fn() },
                },
                {
                    provide: WalletService,
                    useValue: { blockFunds: jest.fn(), releaseFunds: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<BookingsService>(BookingsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a booking and deduct seats', async () => {
            const createBookingDto = { ride_id: 'ride-1', seats: 2 };
            const passenger = { id: 'passenger-1', email: 'test@test.com', first_name: 'Test' } as User;

            const mockRide = {
                id: 'ride-1',
                driver_id: 'driver-1',
                available_seats: 4,
                price_tokens: 10,
                status: RideStatus.OPEN,
                destination: 'Valpo'
            } as Ride;

            mockQueryRunner.manager.findOne.mockResolvedValueOnce(mockRide); // Ride
            mockQueryRunner.manager.findOne.mockResolvedValueOnce({ id: 'wallet-1' }); // Wallet

            mockQueryRunner.manager.create.mockImplementation((entity, dto) => dto);
            mockQueryRunner.manager.save.mockImplementation((entity) => Promise.resolve(entity));

            await service.create(createBookingDto, passenger);

            // Verify seats deducted
            expect(mockRide.available_seats).toBe(2);
            expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(expect.objectContaining({
                available_seats: 2
            }));

            // Verify booking created with PENDING status
            expect(mockQueryRunner.manager.create).toHaveBeenCalledWith(Booking, expect.objectContaining({
                status: BookingStatus.PENDING_APPROVAL
            }));
        });

        it('should throw error if not enough seats', async () => {
            const createBookingDto = { ride_id: 'ride-1', seats: 5 };
            const passenger = { id: 'passenger-1' } as User;

            const mockRide = {
                id: 'ride-1',
                driver_id: 'driver-1',
                available_seats: 4,
            } as Ride;

            mockQueryRunner.manager.findOne.mockResolvedValueOnce(mockRide);

            await expect(service.create(createBookingDto, passenger)).rejects.toThrow('Not enough seats available');
        });
    });
});
