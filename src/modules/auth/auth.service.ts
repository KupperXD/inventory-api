import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/tokenPayload.interface';
import LoginDto from './dto/login.dto';

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
            token,
            cookie: `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
                'jwt_expiration_time',
            )}`,
        };
    }

    public async getAuthenticatedUser(loginDto: LoginDto) {
        try {
            const user = await this.userService.getByEmail(loginDto.email);
            console.log('user getAuthenticatedUser', {
                user,
            });
            await this.verifyPassword(loginDto.password, user.password);
            user.password = null;
            return user;
        } catch (error) {
            throw new HttpException(
                'Wrong credentials provided',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    private async verifyPassword(plainTextPassword: string, hashedPassword) {
        const isPasswordMatching = await compare(
            plainTextPassword,
            hashedPassword,
        );

        if (!isPasswordMatching) {
            throw new HttpException(
                'Wrong credentials provided',
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
