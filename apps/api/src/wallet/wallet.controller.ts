import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsNumber, Min } from 'class-validator';

class AddFundsDto {
    @IsNumber()
    @Min(1)
    amount: number;
}

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @Get()
    getBalance(@Request() req: any) {
        return this.walletService.getBalance(req.user.userId);
    }

    @Post('deposit')
    addFunds(@Request() req: any, @Body() addFundsDto: AddFundsDto) {
        return this.walletService.addFunds(req.user.userId, addFundsDto.amount);
    }
}
