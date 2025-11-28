import { Controller, Get, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { UpdateRideStatusDto } from './dto/update-ride-status.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('stats')
    getStats() {
        return this.adminService.getDashboardStats();
    }

    @Get('users')
    getUsers() {
        return this.adminService.findAllUsers();
    }

    @Get('rides')
    getRides() {
        return this.adminService.findAllRides();
    }

    @Patch('rides/:id/status')
    updateRideStatus(@Param('id') id: string, @Body() dto: UpdateRideStatusDto) {
        return this.adminService.updateRideStatus(id, dto.status);
    }

    @Delete('rides/:id')
    deleteRide(@Param('id') id: string) {
        return this.adminService.deleteRide(id);
    }

    @Patch('users/:id/status')
    updateUserStatus(@Param('id') id: string, @Body() dto: UpdateUserStatusDto) {
        return this.adminService.updateUserStatus(id, dto.status);
    }
}
