import { IsString, IsNotEmpty, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateRideDto {
    @IsString()
    @IsNotEmpty()
    origin: string;

    @IsString()
    @IsNotEmpty()
    destination: string;

    @IsString()
    @IsNotEmpty()
    meeting_point: string;

    @IsString()
    @IsNotEmpty()
    final_point: string;

    @IsDateString()
    departure_time: string;

    @IsNumber()
    @Min(1)
    available_seats: number;

    @IsNumber()
    @Min(0)
    price_tokens: number;
}
