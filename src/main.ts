import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ValidationException } from './exceptions/validation.exception';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaService } from './modules/prisma/service/prisma.service';
import { Logger } from './modules/logger/service/logger.service';
import { EnvironmentVariablesInterface } from './interfaces/enviroment-variables.interface';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log', 'verbose', 'debug'],
        bufferLogs: true,
    });

    const logger = new Logger();
    app.useLogger(logger);

    const configService = app.get<ConfigService<EnvironmentVariablesInterface>>(
        ConfigService<EnvironmentVariablesInterface>,
    );

    const prismaService = app.get(PrismaService);
    await prismaService.enableShutdownHooks(app);
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            exceptionFactory: (errors) => new ValidationException(errors),
        }),
    );

    const swaggerConfig = new DocumentBuilder()
        .setTitle('svk-inventory')
        .setDescription('The inventory API description')
        .setVersion('1.0')
        .addBearerAuth(
            { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
            'access-token',
        )
        .build();

    const documentSwagger = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('api/documentation', app, documentSwagger);

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.listen(configService.get('APPLICATION_PORT'), async () => {
        logger.log(
            `Server started listening: ${configService.get(
                'APPLICATION_PORT',
            )}`,
        );
    });
}
void bootstrap();
