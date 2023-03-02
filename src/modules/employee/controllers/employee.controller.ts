import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseIntPipe,
} from '@nestjs/common';
import { EmployeeService } from '../service/employee.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { EmployeeDto } from '../dto/employee-dto';
import { WithAuthGuardController } from 'src/http/controllers/with-auth-guard.controller';
import { PaginatedCollectionDto } from 'src/http/dto/paginated-collection.dto';
import { ErrorResponseInterface } from 'src/http/errors/interfaces/error-response.interface';
import { PaginatedQueryDto } from 'src/http/dto/paginated-query.dto';
import {
    ApiBody,
    ApiExtraModels,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    getSchemaPath,
} from '@nestjs/swagger';
import { SuccessDto } from 'src/http/dto/success.dto';
import { ApiOkResponsePaginatedDecorator } from 'src/http/decorators/api-ok-response-paginated.decorator';
import { ErrorDto } from 'src/http/dto/errors/error.dto';
import { ApiOkResponseWithErrorDecorator } from '../../../http/decorators/api-ok-response-with-error.decorator';
import { SuccessResponseDecorator } from 'src/http/decorators/success-response.decorator';

@Controller('employee')
@ApiTags('Сотрудники')
export class EmployeeController extends WithAuthGuardController {
    constructor(private readonly employeeService: EmployeeService) {
        super();
    }

    @ApiOperation({
        summary: 'Создание сотрудника',
        description: 'Создание сотрудника',
    })
    @ApiExtraModels(EmployeeDto)
    @ApiOkResponse({
        schema: {
            description: 'Успех',
            properties: {
                response: {
                    type: 'object',
                    $ref: getSchemaPath(EmployeeDto),
                },
            },
        },
    })
    @Post()
    async create(@Body() createEmployeeDto: CreateEmployeeDto) {
        try {
            const employee = await this.employeeService.create(
                createEmployeeDto,
            );

            return this.wrapResponse(new EmployeeDto(employee));
        } catch (e) {
            if (this.isExceptionApi(e)) {
                return this.wrapError(e.getApiError());
            }

            throw e;
        }
    }

    @ApiOperation({
        summary: 'Список сотрудников',
        description: 'Получить список сотрудников с пагинаций',
    })
    @ApiExtraModels(PaginatedCollectionDto)
    @ApiOkResponsePaginatedDecorator(EmployeeDto)
    @Get()
    async paginate(
        @Query()
        query: PaginatedQueryDto,
    ): Promise<ResponseInterface<PaginatedCollectionDto<EmployeeDto>>> {
        const result = await this.employeeService.findAllPaginated(query.page);
        return this.wrapResponse(
            new PaginatedCollectionDto<EmployeeDto>({
                ...result,
                items: result.items.map((employee) => {
                    return new EmployeeDto(employee);
                }),
            }),
        );
    }

    @ApiOperation({
        summary: 'Список сотрудников без пагинации',
        description: 'Получить полный список сотрудников',
    })
    @Get('/all')
    @ApiExtraModels(EmployeeDto)
    @ApiOkResponse({
        schema: {
            allOf: [
                {
                    properties: {
                        items: {
                            type: 'array',
                            items: {
                                $ref: getSchemaPath(EmployeeDto),
                            },
                        },
                    },
                },
            ],
        },
    })
    async findMany() {
        const employees = await this.employeeService.findMany();

        return this.wrapResponse({
            items: employees.map((employee) => new EmployeeDto(employee)),
        });
    }

    @ApiOperation({
        summary: 'Детальная',
        description: 'Детальная информация о сотрудника',
    })
    @ApiExtraModels(ErrorDto)
    @ApiOkResponseWithErrorDecorator(EmployeeDto)
    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: string,
    ): Promise<ResponseInterface<EmployeeDto> | ErrorResponseInterface> {
        try {
            const result = await this.employeeService.findOne(Number(id));

            return this.wrapResponse(result);
        } catch (e) {
            if (this.isExceptionApi(e)) {
                return this.wrapError(e.getApiError());
            }

            throw e;
        }
    }

    @ApiOperation({
        summary: 'Обновить сотрудика',
        description:
            'Запрос для обновления сотрудника, обновляются только те поля которые отправлены',
    })
    @ApiExtraModels(UpdateEmployeeDto)
    @ApiBody({
        schema: {
            type: 'object',
            $ref: getSchemaPath(UpdateEmployeeDto),
        },
    })
    @ApiOkResponseWithErrorDecorator(EmployeeDto)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateEmployeeDto: UpdateEmployeeDto,
    ) {
        try {
            const result = await this.employeeService.update(
                Number(id),
                updateEmployeeDto,
            );
            return this.wrapResponse(new EmployeeDto(result));
        } catch (e) {
            if (this.isExceptionApi(e)) {
                return this.wrapError(e.getApiError());
            }

            throw e;
        }
    }

    @ApiOperation({
        summary: 'Удалить сотрудника',
        description: 'Запрос на удаления сотрудника',
    })
    @SuccessResponseDecorator()
    @Delete(':id')
    async remove(@Param('id') id: string) {
        try {
            await this.employeeService.remove(Number(id));
            return this.wrapResponse(new SuccessDto(true));
        } catch (e) {
            if (this.isExceptionApi(e)) {
                return this.wrapError(e.getApiError());
            }

            throw e;
        }
    }
}
