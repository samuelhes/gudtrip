import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../users/entities/user.entity';
import { Ride } from '../rides/entities/ride.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Ride, Booking])],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
