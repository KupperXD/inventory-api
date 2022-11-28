import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class JwtAuthenticationGuard extends AuthGuard('jwt') {}
