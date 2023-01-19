import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../modules/prisma/service/prisma.service';

@ValidatorConstraint({
    name: 'ExistsEntity',
    async: true,
})
@Injectable()
export class ExistsEntityValidator implements ValidatorConstraintInterface {
    constructor(private readonly prisma: PrismaService) {}

    defaultMessage(args?: ValidationArguments): string {
        return `Сущности с таким значением - ${args.property} - не существует`;
    }

    async validate(
        value: any,
        validationArguments?: ValidationArguments,
    ): Promise<boolean> {
        const [model, property = 'id'] = validationArguments.constraints;

        if (!value || !model) {
            return false;
        }

        const record =
            (await this.prisma[model]?.findUnique({
                where: {
                    [property]: value,
                },
            })) ?? null;

        return record !== null;
    }
}

export function ExistEntity(
    constraints?: string[],
    validationOptions?: ValidationOptions,
) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            constraints,
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: ExistsEntityValidator,
        });
    };
}
