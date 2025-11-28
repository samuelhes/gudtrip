import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from 'src/users/entities/user.entity';
import { Ride } from 'src/rides/entities/ride.entity';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private reviewsRepository: Repository<Review>,
    ) { }

    async create(createReviewDto: CreateReviewDto, reviewer: User): Promise<Review> {
        if (reviewer.id === createReviewDto.reviewee_id) {
            throw new BadRequestException('Cannot review yourself');
        }

        // TODO: Verify that the reviewer and reviewee actually shared a ride (via Booking)
        // For prototype, we skip this check to speed up development.

        const review = this.reviewsRepository.create({
            ...createReviewDto,
            reviewer,
            reviewer_id: reviewer.id,
        });
        return this.reviewsRepository.save(review);
    }

    async findByUser(userId: string): Promise<Review[]> {
        return this.reviewsRepository.find({
            where: { reviewee_id: userId },
            relations: ['reviewer'],
            order: { created_at: 'DESC' },
        });
    }
}
