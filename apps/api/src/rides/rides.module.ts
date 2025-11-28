import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RidesService } from './rides.service';
import { RidesController } from './rides.controller';
import { Ride } from './entities/ride.entity';
import { TravelNeedsModule } from '../travel-needs/travel-needs.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Ride]),
        TravelNeedsModule,
        NotificationsModule,
    ],
    controllers: [RidesController],
    providers: [RidesService],
    exports: [RidesService],
})
export class RidesModule { }
