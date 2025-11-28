import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateBookingDto {
    @IsString()
    @IsNotEmpty()
    ride_id: string;

    @IsNumber()
    @Min(1)
    seats: number;
}
