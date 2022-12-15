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
import { UserWithoutPasswordDto } from '../../users/dto/userWithoutPassword.dto';
import { plainToClass } from 'class-transformer';
import JwtRefreshGuard from '../guards/jwt-refresh.guard';
import { UsersService } from '../../users/users.service';
import ApiController from '../../../http/controllers/api.controller';

@Controller('auth')
export class AuthController extends ApiController {
    constructor(
        private authService: AuthService,
        private userService: UsersService,
    ) {
        super();
    }

    @Post('log-in')
    @HttpCode(200)
    async logIn(
        @Body() loginDto: LoginDto,
        @Req() request: RequestWithUser,
        @Res() response: Response,
    ) {
        try {
            const user = await this.authService.getAuthenticatedUser(loginDto);
            const { cookie } = this.authService.getCookieWithJwtToken(user.id);
            const { cookie: refreshCookie, token: refreshToken } =
                this.authService.getCookieWithJwtRefreshToken(user.id);
            response.setHeader('Set-Cookie', [cookie, refreshCookie]);

            await this.userService.setCurrentRefreshToken(
                refreshToken,
                user.id,
            );

            return response.send(
                this.wrapResponse(plainToClass(UserWithoutPasswordDto, user)),
            );
        } catch (e) {
            throw new HttpException(
                'Wrong credentials provided',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @UseGuards(JwtAuthenticationGuard)
    @Post('log-out')
    @HttpCode(200)
    async logOut(@Req() request: RequestWithUser) {
        await this.userService.removeRefreshToken(request.user.id);
        const cookieForLogOut = await this.authService.getCookieForLogOut();
        request.res.setHeader('Set-Cookie', cookieForLogOut);

        return this.wrapResponse({ success: true });
    }

    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    async refresh(@Req() request: RequestWithUser, @Res() response: Response) {
        const accessToken = this.authService.getCookieWithJwtToken(
            request.user.id,
        );

        response.setHeader('Set-Cookie', accessToken.cookie);

        return response.send(
            this.wrapResponse(
                plainToClass(UserWithoutPasswordDto, request.user),
            ),
        );
    }

    @UseGuards(JwtAuthenticationGuard)
    @Get('current-user')
    @HttpCode(200)
    async currentUser(
        @Req() request: RequestWithUser,
    ): Promise<ResponseInterface<UserWithoutPasswordDto>> {
        const user = request.user;

        return this.wrapResponse(plainToClass(UserWithoutPasswordDto, user));
    }
}
