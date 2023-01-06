import { UserDto } from './user.dto';
import { Exclude } from 'class-transformer';

export class UserWithoutPasswordDto extends UserDto {
    @Exclude()
    public password: string;

    @Exclude()
    public currentHashedRefreshToken: string | null;
}
