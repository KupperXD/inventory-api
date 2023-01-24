import {
    IsEnum,
    IsString,
    IsArray,
    ValidateNested,
    IsOptional,
    IsNotEmpty,
    IsNumber,
} from 'class-validator';
import { SpecificationDto } from './specification.dto';
import { Type } from 'class-transformer';
import { ExistEntity } from '../../../validators/exists-entity.validator';
import { ApiProperty } from '@nestjs/swagger';
import {
    InventoryItemTypesEnum,
    InventoryItemTypesEnumType,
} from '../enums/inventoryItemTypes.enum';

export class CreateInventoryItemDto {
    @ApiProperty({
        type: 'string',
        description: 'Названия имущества',
        required: true,
        example: 'Стол',
    })
    @IsString()
    @IsNotEmpty()
    public name: string;

    @ApiProperty({
        enum: InventoryItemTypesEnum,
        type: InventoryItemTypesEnum,
        description: 'тип имущества',
        example: 'Computer',
        required: true,
    })
    @IsEnum(InventoryItemTypesEnum)
    @IsNotEmpty()
    public type: InventoryItemTypesEnumType;

    @ApiProperty({
        type: SpecificationDto,
        isArray: true,
        description: 'Характеристики имущества',
        nullable: true,
        required: false,
    })
    @IsArray()
    @IsOptional()
    @ValidateNested({
        each: true,
    })
    @Type(() => SpecificationDto)
    public specification?: SpecificationDto[];

    @ApiProperty({
        description: 'id загруженной фотографии',
        type: Number,
        nullable: true,
        example: 1,
        required: false,
    })
    @ExistEntity(['storedFile', 'id'])
    @IsNumber()
    @IsOptional()
    public photoId?: number;

    @ApiProperty({
        description: 'id сотрудника к кому прикреплена вещь',
        type: Number,
        nullable: true,
        example: 3,
        required: false,
    })
    @ExistEntity(['employee', 'id'])
    @IsNumber()
    @IsOptional()
    public employeeId?: number;
}
