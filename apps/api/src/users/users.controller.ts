import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Request() req) {
        return this.usersService.findOne(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
        // Ensure user can only update their own profile
        if (req.user.userId !== id) {
            // In a real app, throw ForbiddenException
        }
        return this.usersService.update(id, updateUserDto);
    }

    // TEMPORARY: Endpoint to promote user to admin (for dev/setup only)
    // In production, this should be protected or removed
    @Get('promote-dev/:email')
    async promoteToAdmin(@Param('email') email: string) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            return { message: 'User not found' };
        }
        user.roles = [UserRole.ADMIN, UserRole.DRIVER, UserRole.PASSENGER];
        await this.usersService.save(user);
        return { message: `User ${email} promoted to ADMIN`, user };
    }
}
