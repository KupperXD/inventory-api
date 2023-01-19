import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UsersService } from '../users/service/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/tokenPayload.interface';
import LoginDto from './dto/login.dto';
import { UserDto } from '../users/dto/user.dto';
import ApiServiceException from '../../exceptions/api-service.exception';
import LoginFailedError from './errors/login-failed.error';
import { EnvironmentVariablesInterface } from '../../interfaces/enviroment-variables.interface';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService<EnvironmentVariablesInterface>,
    ) {}

    public getCookieWithJwtToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload);

        return {
            cookie: `Authentication=${token}; Path=/; Max-Age=${this.configService.get(
                'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
            )}`,
        };
    }

    public getCookieWithJwtRefreshToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: this.configService.get(
                'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
            ),
        });

        return {
            cookie: `Refresh=${token}; Path=/; Max-Age=${this.configService.get(
                'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
            )}`,
            token,
        };
    }

    public async getAuthenticatedUser(loginDto: LoginDto): Promise<UserDto> {
        try {
            const user = await this.userService.getByEmail(loginDto.email);

            await this.verifyPassword(loginDto.password, user.password);

            return user;
        } catch (error) {
            this.throwLoginFailedError();
        }
    }

    public async getCookieForLogOut() {
        return [
            'Authentication=; HttpOnly; Path=/; Max-Age=0',
            'Refresh=; HttpOnly; Path=/; Max-Age=0',
        ];
    }

    private async verifyPassword(plainTextPassword: string, hashedPassword) {
        const isPasswordMatching = await compare(
            plainTextPassword,
            hashedPassword,
        );

        if (!isPasswordMatching) {
            this.throwLoginFailedError();
        }
    }

    private throwLoginFailedError(): void {
        throw new ApiServiceException(new LoginFailedError());
    }
}
