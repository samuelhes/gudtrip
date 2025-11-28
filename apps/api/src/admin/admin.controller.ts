import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

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
}
