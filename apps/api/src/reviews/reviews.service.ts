import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from 'src/users/entities/user.entity';
import { Ride } from 'src/rides/entities/ride.entity';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private reviewsRepository: Repository<Review>,
        private dataSource: DataSource,
    ) { }

    async create(createReviewDto: CreateReviewDto, reviewer: User): Promise<Review> {
        if (reviewer.id === createReviewDto.reviewee_id) {
            throw new BadRequestException('Cannot review yourself');
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const review = queryRunner.manager.create(Review, {
                ...createReviewDto,
                reviewer,
                reviewer_id: reviewer.id,
            });
            await queryRunner.manager.save(review);

            // Update User Reputation
            const reviewee = await queryRunner.manager.findOne(User, { where: { id: createReviewDto.reviewee_id } });
            if (reviewee) {
                const newTotal = reviewee.total_reviews + 1;
                // Calculate new average: (old_avg * old_total + new_rating) / new_total
                const newAverage = ((reviewee.average_rating * reviewee.total_reviews) + createReviewDto.rating) / newTotal;

                reviewee.total_reviews = newTotal;
                reviewee.average_rating = parseFloat(newAverage.toFixed(2));
                await queryRunner.manager.save(reviewee);
            }

            await queryRunner.commitTransaction();
            return review;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async findByUser(userId: string): Promise<Review[]> {
        return this.reviewsRepository.find({
            where: { reviewee_id: userId },
            relations: ['reviewer'],
            order: { created_at: 'DESC' },
        });
    }
}
