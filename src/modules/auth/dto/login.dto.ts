import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        description: 'Email юзера',
        nullable: false,
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Пароль юзера',
        nullable: false,
    })
    @IsNotEmpty()
    password: string;
}

export default LoginDto;
