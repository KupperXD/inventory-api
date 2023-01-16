import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './service/app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { EmployeeModule } from '../employee/employee.module';
import { UniqueConstraintValidator } from '../../validators/unique-constraint.validator';
import { CreateUserCommand } from 'src/console/create-user.command';
import * as Joi from 'joi';
import { LoggerModule } from '../logger/logger.module';
import { StorageModule } from '../storage/storage.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve, join } from 'path';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                APPLICATION_PORT: Joi.number().default(9090),
                UPLOADED_FILES_DESTINATION: Joi.string().default('./storage'),
                JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
                JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
                JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
                JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
            }),
        }),
        PrismaModule,
        UsersModule,
        AuthModule,
        EmployeeModule,
        LoggerModule,
        StorageModule,
    ],
    controllers: [AppController],
    providers: [AppService, UniqueConstraintValidator, CreateUserCommand],
})
export class AppModule {}
