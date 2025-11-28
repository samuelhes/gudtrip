import { IsString, IsNotEmpty, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateRideDto {
    @IsString()
    @IsNotEmpty()
    origin: string;

    @IsString()
    @IsNotEmpty()
    destination: string;

    @IsDateString()
    departure_time: string;

    @IsNumber()
    @Min(1)
    total_seats: number;

    @IsNumber()
    @Min(0)
    price_tokens: number;
}
