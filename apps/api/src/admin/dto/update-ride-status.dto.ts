import { IsString, IsEnum } from 'class-validator';

export enum RideStatus {
    OPEN = 'OPEN',
    FULL = 'FULL',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export class UpdateRideStatusDto {
    @IsEnum(RideStatus)
    status: RideStatus;
}
