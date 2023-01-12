import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './service/app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from '../auth/auth.module';
import { EmployeeModule } from '../employee/employee.module';
import { UniqueConstraintValidator } from '../../validators/unique-constraint.validator';
import { CreateUserCommand } from 'src/console/create-user.command';
import * as Joi from 'joi';

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
        PrismaModule.forRoot({
            isGlobal: true,
        }),
        UsersModule,
        AuthModule,
        EmployeeModule,
    ],
    controllers: [AppController],
    providers: [AppService, UniqueConstraintValidator, CreateUserCommand],
})
export class AppModule {}
