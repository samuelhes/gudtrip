import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Post()
    create(@Body() createBookingDto: CreateBookingDto, @Request() req: any) {
        return this.bookingsService.create(createBookingDto, req.user);
    }

    @Get()
    findAll(@Request() req: any) {
        return this.bookingsService.findAllForUser(req.user.id);
    }

    @Get('received')
    findReceived(@Request() req: any) {
        // We need to implement this method in BookingsService first, but for now let's assume it exists or use a workaround
        // Actually, let's just add the method to the service in the next step if it doesn't exist.
        // Wait, I should check if findAllForDriver exists. It doesn't.
        // I will add the controller method and then the service method.
        return this.bookingsService.findAllForDriver(req.user.id);
    }

    @Patch(':id/accept')
    accept(@Param('id') id: string, @Request() req: any) {
        return this.bookingsService.acceptBooking(id, req.user.id);
    }

    @Patch(':id/reject')
    reject(@Param('id') id: string, @Request() req: any) {
        return this.bookingsService.rejectBooking(id, req.user.id);
    }
}
