import { IsString, IsNotEmpty, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class CreateReviewDto {
    @IsString()
    @IsNotEmpty()
    ride_id: string;

    @IsString()
    @IsNotEmpty()
    reviewee_id: string;

    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @IsString()
    @IsOptional()
    comment?: string;
}
