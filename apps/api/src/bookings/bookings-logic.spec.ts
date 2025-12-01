import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { DataSource } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { WalletService } from '../wallet/wallet.service';
import { User } from '../users/entities/user.entity';
import { Ride, RideStatus } from '../rides/entities/ride.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BookingsService Logic', () => {
    let service: BookingsService;
    let walletService;
    let dataSource;
    let queryRunner;

    const mockPassenger: User = { id: 'passenger-1', first_name: 'Passenger', email: 'p@test.com' } as User;
    const mockDriver: User = { id: 'driver-1', first_name: 'Driver' } as User;
    const mockRide: Ride = {
        id: 'ride-1',
        driver_id: 'driver-1',
        driver: mockDriver,
        price_tokens: 10,
        available_seats: 3,
        status: RideStatus.OPEN,
        destination: 'City B'
    } as Ride;

    const mockWallet: Wallet = { id: 'wallet-1', user_id: 'passenger-1', balance: 100, blocked_balance: 0 } as Wallet;

    beforeEach(async () => {
        queryRunner = {
            connect: jest.fn(),
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
            manager: {
                findOne: jest.fn(),
                create: jest.fn().mockImplementation((entity, dto) => dto),
                save: jest.fn(),
            },
        };

        dataSource = {
            createQueryRunner: jest.fn().mockReturnValue(queryRunner),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookingsService,
                {
                    provide: getRepositoryToken(Booking),
                    useValue: {
                        find: jest.fn(),
                        findOne: jest.fn(),
                        save: jest.fn(),
                    },
                },
                { provide: DataSource, useValue: dataSource },
                {
                    provide: NotificationsService,
                    useValue: { sendBookingConfirmation: jest.fn() },
                },
                {
                    provide: WalletService,
                    useValue: {
                        blockFunds: jest.fn(),
                        captureFunds: jest.fn(),
                        releaseFunds: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<BookingsService>(BookingsService);
        walletService = module.get(WalletService);
    });

    describe('create', () => {
        it('should create a booking successfully', async () => {
            queryRunner.manager.findOne.mockResolvedValueOnce(mockRide); // Ride
            queryRunner.manager.findOne.mockResolvedValueOnce(mockWallet); // Wallet

            const dto = { ride_id: 'ride-1', seats: 2 };
            await service.create(dto as any, mockPassenger);

            expect(walletService.blockFunds).toHaveBeenCalledWith('passenger-1', 20, queryRunner);
            expect(queryRunner.manager.save).toHaveBeenCalledTimes(3); // Transaction, Ride, Booking
            // Ride update check
            const rideUpdateCall = queryRunner.manager.save.mock.calls[1][0];
            expect(rideUpdateCall.available_seats).toBe(1); // 3 - 2
        });

        it('should fail if not enough seats', async () => {
            queryRunner.manager.findOne.mockResolvedValueOnce({ ...mockRide, available_seats: 1 });
            const dto = { ride_id: 'ride-1', seats: 2 };
            await expect(service.create(dto as any, mockPassenger)).rejects.toThrow(BadRequestException);
        });
    });

    describe('acceptBooking', () => {
        it('should accept booking and transfer funds', async () => {
            const mockBooking = {
                id: 'booking-1',
                ride: mockRide,
                passenger: mockPassenger,
                passenger_id: 'passenger-1',
                total_price: 20,
                status: BookingStatus.PENDING_APPROVAL
            };
            queryRunner.manager.findOne.mockResolvedValueOnce(mockBooking); // Booking
            queryRunner.manager.findOne.mockResolvedValueOnce({ id: 'driver-wallet' }); // Driver Wallet

            await service.acceptBooking('booking-1', 'driver-1');

            expect(walletService.captureFunds).toHaveBeenCalledWith('passenger-1', 'driver-1', 20, queryRunner);
            expect(queryRunner.manager.save).toHaveBeenCalledTimes(2); // Transaction, Booking
            expect(queryRunner.commitTransaction).toHaveBeenCalled();
        });

        it('should fail if caller is not driver', async () => {
            const mockBooking = {
                id: 'booking-1',
                ride: mockRide,
                status: BookingStatus.PENDING_APPROVAL
            };
            queryRunner.manager.findOne.mockResolvedValueOnce(mockBooking);

            await expect(service.acceptBooking('booking-1', 'other-user')).rejects.toThrow(BadRequestException);
        });
    });
});
