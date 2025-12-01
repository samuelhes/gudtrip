import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
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

    @Get('my-rides')
    findMyRides(@Request() req: any) {
        return this.ridesService.findAllByDriver(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/start')
    startRide(@Param('id') id: string, @Request() req: any) {
        return this.ridesService.startRide(id, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/complete')
    completeRide(@Param('id') id: string, @Request() req: any) {
        return this.ridesService.completeRide(id, req.user.id);
    }
}
