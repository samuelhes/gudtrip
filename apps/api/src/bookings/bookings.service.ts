import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { User } from 'src/users/entities/user.entity';
import { Ride } from 'src/rides/entities/ride.entity';
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

            // 2. Check Passenger Wallet and Deduct Funds
            const passengerWallet = await queryRunner.manager.findOne(Wallet, { where: { user_id: passenger.id } });
            if (!passengerWallet || Number(passengerWallet.balance) < totalPrice) {
                throw new BadRequestException('Insufficient funds');
            }

            passengerWallet.balance = Number(passengerWallet.balance) - totalPrice;
            await queryRunner.manager.save(passengerWallet);

            // 3. Create Transaction Record (Payment)
            const transaction = queryRunner.manager.create(Transaction, {
                wallet: passengerWallet,
                wallet_id: passengerWallet.id,
                type: TransactionType.PAYMENT,
                amount: -totalPrice,
                description: `Booking for ride to ${ride.destination}`,
            });
            await queryRunner.manager.save(transaction);

            // 4. Update Ride Seats
            ride.available_seats -= createBookingDto.seats;
            if (ride.available_seats === 0) {
                ride.status = 'FULL';
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
                status: BookingStatus.CONFIRMED,
            });
            await queryRunner.manager.save(booking);

            // TODO: Credit driver's wallet (or hold in escrow) - For now, we just deduct from passenger
            // In a real system, we might move this to an escrow wallet until the ride completes.

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

    async findAllForUser(userId: string): Promise<Booking[]> {
        return this.bookingsRepository.find({
            where: { passenger_id: userId },
            relations: ['ride', 'ride.driver'],
            order: { created_at: 'DESC' },
        });
    }
}
