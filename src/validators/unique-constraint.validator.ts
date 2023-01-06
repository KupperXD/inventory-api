import { PrismaService } from 'nestjs-prisma';
import {
    ValidatorConstraintInterface,
    ValidatorConstraint,
    ValidationArguments,
    ValidationOptions,
    registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'Unique', async: true })
@Injectable()
export class UniqueConstraintValidator implements ValidatorConstraintInterface {
    constructor(private readonly prisma: PrismaService) {}

    async validate(value: any, args?: ValidationArguments): Promise<boolean> {
        const [model, property = 'id', exceptField = null] = args.constraints;

        if (!value || !model) {
            return false;
        }

        const record = await this.prisma[model]?.findUnique({
            where: {
                [property]: value,
            },
        });

        if (record === null) {
            return true;
        }

        if (!exceptField) {
            return false;
        }

        const exceptFieldValue = (args.object as any)[exceptField];

        if (!exceptFieldValue) {
            return false;
        }

        return record[exceptField] === exceptFieldValue;
    }

    defaultMessage(args?: ValidationArguments): string {
        return `${args.property} entered is not valid`;
    }
}

export function Unique(
    constraints?: string[],
    validationOptions?: ValidationOptions,
) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            constraints,
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: UniqueConstraintValidator,
        });
    };
}
