import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/tokenPayload.interface';
import LoginDto from './dto/login.dto';
import { UserDto } from '../users/dto/user.dto';
import ApiServiceException from '../../exceptions/api-service.exception';
import LoginFailedError from './errors/login-failed.error';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    public getCookieWithJwtToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload);

        return {
            cookie: `Authentication=${token}; Path=/; Max-Age=${this.configService.get(
                'jwt_access_expiration_time',
            )}`,
        };
    }

    public getCookieWithJwtRefreshToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('jwt_refresh_secret'),
            expiresIn: this.configService.get('jwt_refresh_expiration_time'),
        });

        return {
            cookie: `Refresh=${token}; Path=/; Max-Age=${this.configService.get(
                'jwt_refresh_expiration_time',
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
