import {
    IsEnum,
    IsString,
    IsArray,
    ValidateNested,
    IsOptional,
    IsNotEmpty,
    IsNumber,
} from 'class-validator';
import { InventoryItemTypes } from '@prisma/client';
import { SpecificationDto } from './specification.dto';
import { Type } from 'class-transformer';
import { ExistEntity } from '../../../validators/exists-entity.validator';

export class CreateInventoryItemDto {
    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsEnum(InventoryItemTypes)
    @IsNotEmpty()
    public type: InventoryItemTypes;

    @IsArray()
    @IsOptional()
    @ValidateNested({
        each: true,
    })
    @Type(() => SpecificationDto)
    public specification?: SpecificationDto[];

    @ExistEntity(['storedFile', 'id'])
    @IsNumber()
    @IsOptional()
    public photoId?: number;

    @ExistEntity(['employee', 'id'])
    @IsNumber()
    @IsOptional()
    public employeeId?: number;
}
