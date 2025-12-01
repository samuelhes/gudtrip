import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password_hash))) {
            const { password_hash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { email: user.email, sub: user.id, roles: user.roles };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }

    async register(createUserDto: CreateUserDto) {
        const user = await this.usersService.create(createUserDto);
        const payload = { email: user.email, sub: user.id, roles: user.roles };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }

    async forgotPassword(email: string) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            // Don't reveal if user exists
            return { message: 'If email exists, reset instructions have been sent.' };
        }

        const payload = { email: user.email, sub: user.id, type: 'password_reset' };
        const token = this.jwtService.sign(payload, { expiresIn: '1h' });

        // In a real app, send email with link: https://gudtrip.com/reset-password?token=${token}
        // For now, we return the token for testing purposes or log it
        console.log(`Password reset token for ${email}: ${token}`);

        // TODO: Integrate with NotificationsService to send email
        return { message: 'If email exists, reset instructions have been sent.', token }; // Returning token for dev convenience
    }

    async resetPassword(token: string, newPassword: string) {
        try {
            const payload = this.jwtService.verify(token);
            if (payload.type !== 'password_reset') {
                throw new UnauthorizedException('Invalid token type');
            }

            const user = await this.usersService.findOne(payload.sub);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await this.usersService.update(user.id, { password_hash: hashedPassword });

            return { message: 'Password successfully reset' };
        } catch (e) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
