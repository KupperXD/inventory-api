import { CommandRunner, Command, Option } from 'nest-commander';
import { UsersService } from '../modules/users/users.service';

interface CreateUserOptions {
    email: string;
    password: string;
}

@Command({ name: 'create-user', description: 'Создание пользователя' })
export class CreateUserCommand extends CommandRunner {
    constructor(private readonly userService: UsersService) {
        super();
    }
    async run(
        passedParam: string[],
        options?: CreateUserOptions,
    ): Promise<void> {
        if (!options) {
            return;
        }
        const user = await this.userService.create({
            name: options.email,
            email: options.email,
            password: options.password,
        });

        console.log(`Пользователь с email ${user.email} успешно создан!`);
    }

    @Option({
        flags: '-e, --email [email]',
        description: 'Uniq email',
        name: 'email',
    })
    parseEmail(val: string): string {
        return val;
    }

    @Option({
        flags: '-p, --password [password]',
        description: 'Password',
    })
    parsePassword(val: string): string {
        return val;
    }
}
