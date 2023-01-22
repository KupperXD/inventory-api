import { EmployeeDto } from '../../employee/dto/employee-dto';
import { FileDto } from '../../storage/dto/file.dto';
import { SpecificationDto } from './specification.dto';
import { InventoryItemWithRelationsType } from '../models/inventory-item-with-relations.type';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import {
    InventoryItemTypesEnum,
    InventoryItemTypesEnumType,
} from '../enums/inventoryItemTypes.enum';

@ApiExtraModels(SpecificationDto, FileDto, EmployeeDto)
export class InventoryItemOutDto {
    @ApiProperty({
        description: 'id',
        required: false,
        type: Number,
        example: 1,
    })
    public id: number;

    @ApiProperty({
        description: 'Название',
        required: false,
        type: String,
        example: 'стол',
    })
    public name: string;

    @ApiProperty({
        description: 'Тип имущества',
        required: false,
        type: InventoryItemTypesEnum,
        enum: InventoryItemTypesEnum,
    })
    public type: InventoryItemTypesEnumType;

    @ApiProperty({
        description: 'Владелец',
        type: EmployeeDto,
        nullable: true,
        required: false,
    })
    public employee: EmployeeDto | null;

    @ApiProperty({
        description: 'Фотография',
        type: FileDto,
        nullable: true,
        required: false,
    })
    public photo: FileDto | null;

    @ApiProperty({
        isArray: true,
        description: 'Характеристики',
        type: SpecificationDto,
        nullable: true,
        required: false,
    })
    public specifications: SpecificationDto[] | null;

    constructor(model: InventoryItemWithRelationsType) {
        this.id = model.id;
        this.name = model.name;
        this.type = model.type;
        this.employee = model?.employee ?? null;
        this.photo = model.photo ? new FileDto(model.photo) : null;
        this.specifications =
            (model?.specification as unknown as SpecificationDto[]) ?? null;
    }
}
