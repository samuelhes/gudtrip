import { Module, Global } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ConfigModule } from '@nestjs/config';

@Global() // Make it global so we don't have to import it everywhere
@Module({
    imports: [ConfigModule],
    providers: [NotificationsService],
    exports: [NotificationsService],
})
export class NotificationsModule { }
