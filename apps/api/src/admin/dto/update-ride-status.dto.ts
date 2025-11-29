import { IsEnum } from 'class-validator';
import { RideStatus } from '../../rides/entities/ride.entity';

export class UpdateRideStatusDto {
    @IsEnum(RideStatus)
    status: RideStatus;
}
