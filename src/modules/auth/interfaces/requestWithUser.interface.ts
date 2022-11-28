import { Request } from 'express';
import { CreateUserDto } from '../../users/dto/createUser.dto';

export interface RequestWithUser extends Request {
    user: CreateUserDto;
}
