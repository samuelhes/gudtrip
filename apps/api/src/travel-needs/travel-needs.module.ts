import { Module } from '@nestjs/common';
import { TravelNeedsService } from './travel-needs.service';
import { TravelNeedsController } from './travel-needs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelNeed } from './entities/travel-need.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TravelNeed])],
    controllers: [TravelNeedsController],
    providers: [TravelNeedsService],
    exports: [TravelNeedsService],
})
export class TravelNeedsModule { }
