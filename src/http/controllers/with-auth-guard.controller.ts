import ApiController from './api.controller';
import { UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from '../../modules/auth/guards/jwt-authentication.guard';

@UseGuards(JwtAuthenticationGuard)
export class WithAuthGuardController extends ApiController {}
