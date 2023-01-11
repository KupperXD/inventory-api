import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty({
        example: 1,
    })
    public id: number;
    @ApiProperty({
        example: 'email@gmail.com',
    })
    public email: string;
    public password: string | null;
    @ApiProperty({
        example: 'Дима',
    })
    public name: string;
    public currentHashedRefreshToken: string | null;
}
