export class CreateUserDto {
    public id: number;
    public email: string;
    public password: string | null;
    public name: string;
}
