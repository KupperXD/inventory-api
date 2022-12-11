import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ValidationException } from './http/errors/exceptions/validation.exception';
import { useContainer } from 'class-validator';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get<ConfigService>(ConfigService);
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (errors) => new ValidationException(errors),
        }),
    );

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.listen(configService.get('port'));
}
void bootstrap();
