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

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        PrismaModule.forRoot({
            isGlobal: true,
        }),
        UsersModule,
        AuthModule,
        EmployeeModule,
    ],
    controllers: [AppController],
    providers: [AppService, UniqueConstraintValidator],
})
export class AppModule {}
