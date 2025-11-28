import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Ride } from '../rides/entities/ride.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Ride)
        private ridesRepository: Repository<Ride>,
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
    ) { }

    async getDashboardStats() {
        const totalUsers = await this.usersRepository.count();
        const totalRides = await this.ridesRepository.count();
        const totalBookings = await this.bookingsRepository.count();

        // Calculate total revenue (tokens spent)
        const bookings = await this.bookingsRepository.find();
        const totalRevenue = bookings.reduce((sum, booking) => sum + Number(booking.total_price), 0);

        return {
            totalUsers,
            totalRides,
            totalBookings,
            totalRevenue,
        };
    }

    async findAllUsers() {
        return this.usersRepository.find({
            order: { created_at: 'DESC' },
        });
    }

    async findAllRides() {
        return this.ridesRepository.find({
            relations: ['driver'],
            order: { created_at: 'DESC' },
        });
    }
}
