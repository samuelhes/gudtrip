import { Module, Global } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { ConfigModule } from '@nestjs/config';

@Global() // Make it global so we don't have to import it everywhere
@Module({
    imports: [
        TypeOrmModule.forFeature([Notification]),
        ConfigModule,
    ],
    controllers: [NotificationsController],
    providers: [NotificationsService],
    exports: [NotificationsService],
})
export class NotificationsModule { }
