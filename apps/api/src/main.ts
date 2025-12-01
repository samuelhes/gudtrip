import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: [
            'http://localhost:5173',
            'https://gudtrip.vercel.app',
            /\.vercel\.app$/
        ],
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    await app.listen(3000);
    Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
