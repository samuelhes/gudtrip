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
                lock: { mode: 'pessimistic_write' } // Lock ride row to prevent race conditions
            });

            if (!ride) throw new NotFoundException('Ride not found');
            if (ride.driver_id === passenger.id) throw new BadRequestException('Driver cannot book their own ride');
            if (ride.available_seats < createBookingDto.seats) throw new BadRequestException('Not enough seats available');

            const totalPrice = Number(ride.price_tokens) * createBookingDto.seats;

            // 2. Check Passenger Wallet and Block Funds
            await this.walletService.blockFunds(passenger.id, totalPrice, queryRunner);

            // 3. Create Transaction Record (Reservation Hold)
            const passengerWallet = await queryRunner.manager.findOne(Wallet, { where: { user_id: passenger.id } });
            const transaction = queryRunner.manager.create(Transaction, {
                wallet: passengerWallet,
                wallet_id: passengerWallet.id,
                type: TransactionType.RESERVATION,
                amount: -totalPrice,
                description: `Reservation hold for ride to ${ride.destination}`,
            });
            await queryRunner.manager.save(transaction);

            // 4. Update Ride Seats
            // Deduct seats immediately to prevent overbooking. If rejected, add back.
            ride.available_seats -= createBookingDto.seats;
            if (ride.available_seats < 0) {
                throw new BadRequestException('Not enough seats available');
            }
            if (ride.available_seats === 0) {
                ride.status = RideStatus.FULL;
            }
            await queryRunner.manager.save(ride);

            // 5. Create Booking
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

            // 6. Send Notification (Async)
            this.notificationsService.sendBookingConfirmation(passenger.email, passenger.first_name, ride);

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
            const booking = await queryRunner.manager.findOne(Booking, { where: { id: bookingId }, relations: ['ride', 'passenger'] });
            if (!booking) throw new NotFoundException('Booking not found');
            if (booking.ride.driver_id !== driverId) throw new BadRequestException('Only driver can accept booking');
            if (booking.status !== BookingStatus.PENDING_APPROVAL) throw new BadRequestException('Booking is not pending');

            // Transfer funds from passenger blocked balance to driver wallet
            await this.walletService.captureFunds(booking.passenger_id, driverId, Number(booking.total_price), queryRunner);

            // Create Transaction Record for Driver (Income)
            const driverWallet = await queryRunner.manager.findOne(Wallet, { where: { user_id: driverId } });
            const transaction = queryRunner.manager.create(Transaction, {
                wallet: driverWallet,
                wallet_id: driverWallet.id,
                type: TransactionType.PAYMENT,
                amount: booking.total_price,
                description: `Payment for ride from ${booking.passenger.first_name}`,
            });
            await queryRunner.manager.save(transaction);

            booking.status = BookingStatus.APPROVED;
            await queryRunner.manager.save(booking);

            await queryRunner.commitTransaction();

            // Send Notification
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

            // Refund tokens
            await this.walletService.releaseFunds(booking.passenger_id, booking.total_price, queryRunner);

            // Return seats
            const ride = booking.ride;
            ride.available_seats += booking.seats_booked;
            ride.status = RideStatus.OPEN; // Re-open if it was full
            await queryRunner.manager.save(ride);

            booking.status = BookingStatus.REJECTED;
            await queryRunner.manager.save(booking);

            await queryRunner.commitTransaction();
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
