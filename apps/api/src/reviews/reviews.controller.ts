import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createReviewDto: CreateReviewDto, @Request() req: any) {
        return this.reviewsService.create(createReviewDto, req.user);
    }

    @Get('user/:userId')
    findByUser(@Param('userId') userId: string) {
        return this.reviewsService.findByUser(userId);
    }
}
