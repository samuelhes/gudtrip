import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { User } from 'src/users/entities/user.entity';
import { Ride, RideStatus } from 'src/rides/entities/ride.entity';
import { WalletService } from 'src/wallet/wallet.service';
import { TransactionType } from 'src/wallet/entities/transaction.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { Transaction } from 'src/wallet/entities/transaction.entity';

import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
        private dataSource: DataSource,
        private notificationsService: NotificationsService,
        private walletService: WalletService,
    ) { }

    async create(createBookingDto: CreateBookingDto, passenger: User): Promise<Booking> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Get Ride and check availability
            const ride = await queryRunner.manager.findOne(Ride, {
                where: { id: createBookingDto.ride_id },
                // We don't lock here because we are not deducting seats yet.
                // Overbooking check happens at acceptance time.
            });

            if (!ride) throw new NotFoundException('Ride not found');
            if (ride.driver_id === passenger.id) throw new BadRequestException('Driver cannot book their own ride');
            // Basic check, but real check is at acceptance
            if (ride.available_seats < createBookingDto.seats) throw new BadRequestException('Not enough seats available');

            const totalPrice = Number(ride.price_tokens) * createBookingDto.seats;

            // 2. Create Booking (PENDING_APPROVAL)
            // No funds blocked yet.
            const booking = queryRunner.manager.create(Booking, {
                ride,
                ride_id: ride.id,
                passenger,
                passenger_id: passenger.id,
                seats_booked: createBookingDto.seats,
                total_price: totalPrice,
                status: BookingStatus.PENDING_APPROVAL,
            });
            await queryRunner.manager.save(booking);

            await queryRunner.commitTransaction();

            // 3. Send Notification to Driver (Async)
            // We need to fetch driver details or use ride.driver if eager loaded
            // ride.driver is eager loaded in Ride entity
            if (ride.driver) {
                this.notificationsService.sendTripRequestNotification(ride.driver.id, passenger.first_name, ride, booking.id);
            }

            return booking;

        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async acceptBooking(bookingId: string, driverId: string): Promise<Booking> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Lock the booking and ride to prevent race conditions
            const booking = await queryRunner.manager.findOne(Booking, {
                where: { id: bookingId },
                relations: ['ride', 'passenger'],
                lock: { mode: 'pessimistic_write' }
            });

            if (!booking) throw new NotFoundException('Booking not found');
            if (booking.ride.driver_id !== driverId) throw new BadRequestException('Only driver can accept booking');
            if (booking.status !== BookingStatus.PENDING_APPROVAL) throw new BadRequestException('Booking is not pending');

            // 1. Re-check Ride Availability (Atomic Check)
            const ride = await queryRunner.manager.findOne(Ride, {
                where: { id: booking.ride_id },
                lock: { mode: 'pessimistic_write' }
            });

            if (ride.available_seats < booking.seats_booked) {
                throw new BadRequestException('Not enough seats available to accept this booking');
            }

            // 2. Check Passenger Balance & Capture Funds
            // We use captureFunds directly. It should handle checking balance.
            // If captureFunds fails (insufficient funds), it throws, and we rollback.
            await this.walletService.captureFunds(booking.passenger_id, driverId, Number(booking.total_price), queryRunner);

            // 3. Create Transaction Record for Driver (Income)
            const driverWallet = await queryRunner.manager.findOne(Wallet, { where: { user_id: driverId } });
            const transaction = queryRunner.manager.create(Transaction, {
                wallet: driverWallet,
                wallet_id: driverWallet.id,
                type: TransactionType.PAYMENT,
                amount: booking.total_price,
                description: `Payment for ride from ${booking.passenger.first_name}`,
            });
            await queryRunner.manager.save(transaction);

            // 4. Deduct Seats
            ride.available_seats -= booking.seats_booked;
            if (ride.available_seats === 0) {
                ride.status = RideStatus.FULL;
            }
            await queryRunner.manager.save(ride);

            // 5. Update Booking Status
            booking.status = BookingStatus.APPROVED;
            await queryRunner.manager.save(booking);

            await queryRunner.commitTransaction();

            // 6. Send Notification
            this.notificationsService.sendBookingConfirmation(booking.passenger.email, booking.passenger.first_name, booking.ride);

            return booking;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async rejectBooking(bookingId: string, driverId: string): Promise<Booking> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const booking = await queryRunner.manager.findOne(Booking, { where: { id: bookingId }, relations: ['ride'] });
            if (!booking) throw new NotFoundException('Booking not found');
            if (booking.ride.driver_id !== driverId) throw new BadRequestException('Only driver can reject booking');
            if (booking.status !== BookingStatus.PENDING_APPROVAL) throw new BadRequestException('Booking is not pending');

            // No refund needed as funds were not blocked.
            // No seat return needed as seats were not deducted.

            booking.status = BookingStatus.REJECTED;
            await queryRunner.manager.save(booking);

            await queryRunner.commitTransaction();

            // Notify passenger
            this.notificationsService.sendBookingRejection(booking.passenger.email, booking.passenger.first_name, booking.ride);

            return booking;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async findAllForUser(userId: string): Promise<Booking[]> {
        return this.bookingsRepository.find({
            where: { passenger_id: userId },
            relations: ['ride', 'ride.driver'],
            order: { created_at: 'DESC' },
        });
    }

    async findAllForDriver(driverId: string): Promise<Booking[]> {
        return this.bookingsRepository.find({
            where: { ride: { driver_id: driverId } },
            relations: ['ride', 'passenger'],
            order: { created_at: 'DESC' },
        });
    }
}
