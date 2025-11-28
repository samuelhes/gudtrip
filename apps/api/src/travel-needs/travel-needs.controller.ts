import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TravelNeedsService } from './travel-needs.service';
import { CreateTravelNeedDto } from './dto/create-travel-need.dto';
// import { UpdateTravelNeedDto } from './dto/update-travel-need.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('travel-needs')
export class TravelNeedsController {
    constructor(private readonly travelNeedsService: TravelNeedsService) { }

    @Post()
    // @UseGuards(JwtAuthGuard)
    create(@Body() createTravelNeedDto: CreateTravelNeedDto, @Request() req: any) { // @Request() req
        // const userId = req.user.id;
        // return this.travelNeedsService.create(createTravelNeedDto, userId);
        return this.travelNeedsService.create(createTravelNeedDto, req.user);
    }

    @Get()
    findAll() {
        return this.travelNeedsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.travelNeedsService.findOne(id);
    }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateTravelNeedDto: UpdateTravelNeedDto) {
    //   return this.travelNeedsService.update(id, updateTravelNeedDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //   return this.travelNeedsService.remove(id);
    // }
}
