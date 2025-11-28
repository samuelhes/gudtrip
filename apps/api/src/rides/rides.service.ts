import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ride } from './entities/ride.entity';
import { CreateRideDto } from './dto/create-ride.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RidesService {
    constructor(
        @InjectRepository(Ride)
        private ridesRepository: Repository<Ride>,
    ) { }

    async create(createRideDto: CreateRideDto, driver: User): Promise<Ride> {
        const ride = this.ridesRepository.create({
            ...createRideDto,
            available_seats: createRideDto.total_seats,
            driver,
            driver_id: driver.id,
        });
        return this.ridesRepository.save(ride);
    }

    async findAll(): Promise<Ride[]> {
        return this.ridesRepository.find({
            order: { departure_time: 'ASC' },
            where: { status: 'OPEN' },
        });
    }

    async findOne(id: string): Promise<Ride | null> {
        return this.ridesRepository.findOne({ where: { id } });
    }
}
