import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../auth.service';
import { RequestWithUser } from '../interfaces/requestWithUser.interface';
import LoginDto from '../dto/login.dto';
import JwtAuthenticationGuard from '../guards/jwt-authentication.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('log-in')
    @HttpCode(200)
    async logIn(
        @Body() loginDto: LoginDto,
        @Req() request: RequestWithUser,
        @Res() response: Response,
    ) {
        try {
            const user = await this.authService.getAuthenticatedUser(loginDto);
            const { token, cookie } = this.authService.getCookieWithJwtToken(1);
            response.setHeader('Set-Cookie', cookie);
            user.password = null;
            return response.send({
                token,
            });
        } catch (e) {
            throw new HttpException(
                'Wrong credentials provided',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @UseGuards(JwtAuthenticationGuard)
    @Get('current-user')
    @HttpCode(200)
    async currentUser(@Req() request: RequestWithUser) {
        const user = request.user;
        user.password = null;

        return user;
    }
}
