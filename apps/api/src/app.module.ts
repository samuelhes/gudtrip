// Force redeploy: Add meeting_point and final_point columns
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RidesModule } from './rides/rides.module';
import { WalletModule } from './wallet/wallet.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST', 'localhost'),
                port: configService.get<number>('DB_PORT', 5432),
                username: configService.get<string>('DB_USER', 'gudtrip'),
                password: configService.get<string>('DB_PASSWORD', 'gudtrip_password'),
                database: configService.get<string>('DB_NAME', 'gudtrip_db'),
                autoLoadEntities: true,
                synchronize: true, // Auto-create tables (dev only)
            }),
            inject: [ConfigService],
        }),
        UsersModule,
        AuthModule,
        RidesModule,
        WalletModule,
        BookingsModule,
        ReviewsModule,
        ReviewsModule,
        NotificationsModule,
        AdminModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
