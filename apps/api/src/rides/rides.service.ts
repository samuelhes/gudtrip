import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateRideDto } from './dto/create-ride.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ride, RideStatus } from './entities/ride.entity';
import { User } from '../users/entities/user.entity';
import { TravelNeedsService } from '../travel-needs/travel-needs.service';
import { NotificationsService } from '../notifications/notifications.service';

import { Booking, BookingStatus } from '../bookings/entities/booking.entity';

@Injectable()
export class RidesService {
    constructor(
        @InjectRepository(Ride)
        private ridesRepository: Repository<Ride>,
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
        private travelNeedsService: TravelNeedsService,
        private notificationsService: NotificationsService,
    ) { }

    async create(createRideDto: CreateRideDto, driver: User): Promise<Ride> {
        if (new Date(createRideDto.departure_time) < new Date()) {
            throw new BadRequestException('La fecha de salida no puede ser en el pasado');
        }

        const ride = this.ridesRepository.create({
            ...createRideDto,
            driver,
            total_seats: createRideDto.available_seats,
            available_seats: createRideDto.available_seats, // Initialize available_seats
            status: RideStatus.OPEN,
        });
        const savedRide = await this.ridesRepository.save(ride);

        // Trigger Matching
        const matches = await this.travelNeedsService.findMatchesForTrip(savedRide);
        if (matches.length > 0) {
            // Send notifications to matched users
            for (const match of matches) {
                // Assuming match has user loaded or user_id
                // We might need to fetch user email if not eager loaded
                // For now, let's assume we have user_id and NotificationsService handles it or we fetch user
                // Actually TravelNeed entity has user relation but eager=false.
                // We should probably load user in findMatchesForTrip or here.
                // Let's update findMatchesForTrip to leftJoinAndSelect user.
                // Or just use user_id if NotificationsService supports it.
                // NotificationsService.sendMatchNotification(userId, ride)
                await this.notificationsService.sendMatchNotification(match.user_id, savedRide);
            }
        }

        return savedRide;
    }

    findAll() {
        return this.ridesRepository.find({
            where: { status: RideStatus.OPEN },
            order: { departure_time: 'ASC' },
            relations: ['driver'], // Eager load driver
        });
    }

    findAllByDriver(driverId: string) {
        return this.ridesRepository.find({
            where: { driver_id: driverId },
            order: { departure_time: 'DESC' },
        });
    }

    findOne(id: string) {
        return this.ridesRepository.findOne({ where: { id } });
    }
    async startRide(id: string, driverId: string): Promise<Ride> {
        const ride = await this.ridesRepository.findOne({ where: { id } });
        if (!ride) throw new BadRequestException('Ride not found');
        if (ride.driver_id !== driverId) throw new BadRequestException('Only driver can start ride');
        if (ride.status !== RideStatus.OPEN && ride.status !== RideStatus.FULL) throw new BadRequestException('Ride cannot be started');

        ride.status = RideStatus.IN_PROGRESS;
        return this.ridesRepository.save(ride);
    }

    async completeRide(id: string, driverId: string): Promise<Ride> {
        const ride = await this.ridesRepository.findOne({ where: { id } });
        if (!ride) throw new BadRequestException('Ride not found');
        if (ride.driver_id !== driverId) throw new BadRequestException('Only driver can complete ride');
        if (ride.status !== RideStatus.IN_PROGRESS) throw new BadRequestException('Ride is not in progress');

        ride.status = RideStatus.COMPLETED;
        const savedRide = await this.ridesRepository.save(ride);

        // Update all approved bookings to COMPLETED
        await this.bookingsRepository.update(
            { ride_id: id, status: BookingStatus.APPROVED },
            { status: BookingStatus.COMPLETED }
        );

        return savedRide;
    }
}
