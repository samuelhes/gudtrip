import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { User, UserStatus } from '../users/entities/user.entity';
import { Ride, RideStatus } from '../rides/entities/ride.entity';
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

        // New stats: recent rides (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentRides = await this.ridesRepository.count({
            where: {
                created_at: MoreThan(sevenDaysAgo)
            }
        });

        // Active users this month
        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);
        firstDayOfMonth.setHours(0, 0, 0, 0);

        const activeUsers = await this.usersRepository.count({
            where: {
                created_at: MoreThan(firstDayOfMonth)
            }
        });

        return {
            totalUsers,
            totalRides,
            totalBookings,
            totalRevenue,
            recentRides,
            activeUsers,
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

    async updateRideStatus(id: string, status: RideStatus) {
        const ride = await this.ridesRepository.findOne({ where: { id } });
        if (!ride) {
            throw new NotFoundException('Ride not found');
        }

        ride.status = status;
        return this.ridesRepository.save(ride);
    }

    async deleteRide(id: string) {
        const result = await this.ridesRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Ride not found');
        }
        return { message: 'Ride deleted successfully' };
    }

    async updateUserStatus(id: string, status: UserStatus) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.status = status;
        return this.usersRepository.save(user);
    }
}
