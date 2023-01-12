import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';

@Module({
    controllers: [AuthController],
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (
                configService: ConfigService<EnvironmentVariablesInterface>,
            ) => {
                return {
                    secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
                    signOptions: {
                        expiresIn: `${configService.get(
                            'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
                        )}s`,
                    },
                };
            },
        }),
    ],
    providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
