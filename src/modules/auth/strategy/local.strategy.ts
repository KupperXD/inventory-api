import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(username: string, password: string): Promise<unknown> {
        const user = await this.authService.getAuthenticatedUser({
            email: username,
            password,
        });

        return Promise.resolve({
            name: 'dima',
        });
    }
}
