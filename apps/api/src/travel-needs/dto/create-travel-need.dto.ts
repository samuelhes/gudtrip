import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateTravelNeedDto {
    @IsString()
    @IsNotEmpty()
    origin_city: string;

    @IsString()
    @IsNotEmpty()
    destination_city: string;

    @IsDateString()
    date: string; // YYYY-MM-DD

    @IsString()
    @IsNotEmpty()
    start_time: string; // HH:mm

    @IsString()
    @IsNotEmpty()
    end_time: string; // HH:mm
}
