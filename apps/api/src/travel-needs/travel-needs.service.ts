import { Injectable } from '@nestjs/common';
import { CreateTravelNeedDto } from './dto/create-travel-need.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TravelNeed, TravelNeedStatus } from './entities/travel-need.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TravelNeedsService {
    constructor(
        @InjectRepository(TravelNeed)
        private travelNeedsRepository: Repository<TravelNeed>,
    ) { }

    private timeToBlock(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return Math.floor((hours * 60 + minutes) / 5);
    }

    async create(createTravelNeedDto: CreateTravelNeedDto, user: User) {
        const start_block = this.timeToBlock(createTravelNeedDto.start_time);
        const end_block = this.timeToBlock(createTravelNeedDto.end_time);

        const travelNeed = this.travelNeedsRepository.create({
            ...createTravelNeedDto,
            user,
            user_id: user.id,
            start_block,
            end_block,
            status: TravelNeedStatus.ACTIVE,
        });
        return this.travelNeedsRepository.save(travelNeed);
    }

    async findMatchesForTrip(trip: any) {
        // trip has origin, destination, departure_time (Date)
        const tripDate = new Date(trip.departure_time);
        const dateStr = tripDate.toISOString().split('T')[0];
        const minutes = tripDate.getHours() * 60 + tripDate.getMinutes();
        const trip_block = Math.floor(minutes / 5);

        const matches = await this.travelNeedsRepository.createQueryBuilder('need')
            .where('need.origin_city = :origin', { origin: trip.origin })
            .andWhere('need.destination_city = :destination', { destination: trip.destination })
            .andWhere('need.date = :date', { date: dateStr })
            .andWhere('need.status = :status', { status: TravelNeedStatus.ACTIVE })
            .andWhere(':trip_block >= need.start_block', { trip_block })
            .andWhere(':trip_block <= need.end_block', { trip_block })
            .getMany();

        return matches;
    }

    findAll() {
        return this.travelNeedsRepository.find();
    }

    findOne(id: string) {
        return this.travelNeedsRepository.findOne({ where: { id } });
    }
}
