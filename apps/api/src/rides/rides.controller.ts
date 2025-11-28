import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { RidesService } from './rides.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('rides')
export class RidesController {
    constructor(private readonly ridesService: RidesService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createRideDto: CreateRideDto, @Request() req: any) {
        return this.ridesService.create(createRideDto, req.user);
    }

    @Get()
    findAll() {
        return this.ridesService.findAll();
    }
}
