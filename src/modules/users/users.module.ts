import { Module } from '@nestjs/common';
import { UsersService } from './service/users.service';
import UserRepository from './repository/user.repository';

@Module({
    providers: [UsersService, UserRepository],
    exports: [UsersService],
})
export class UsersModule {}
