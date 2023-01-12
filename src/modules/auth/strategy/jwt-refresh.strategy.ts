import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/service/users.service';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { TokenPayload } from '../interfaces/tokenPayload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh-token',
) {
    constructor(
        private readonly configService: ConfigService<EnvironmentVariablesInterface>,
        private readonly userService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.Refresh;
                },
            ]),
            secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(request: Request, payload: TokenPayload) {
        const refreshToken = request.cookies?.Refresh;

        return this.userService.getUserIfRefreshTokenMatches(
            refreshToken,
            payload.userId,
        );
    }
}
