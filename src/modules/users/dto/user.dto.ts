export class UserDto {
    public id: number;
    public email: string;
    public password: string | null;
    public name: string;
    public currentHashedRefreshToken: string | null;
}
