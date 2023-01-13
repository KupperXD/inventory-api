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
import {LoggerModule} from "../logger/logger.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                APPLICATION_PORT: Joi.number().default(9090),
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
    ],
    controllers: [AppController],
    providers: [AppService, UniqueConstraintValidator, CreateUserCommand],
})
export class AppModule {}
