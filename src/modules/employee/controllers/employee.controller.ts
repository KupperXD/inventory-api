import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { EmployeeService } from '../service/employee.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { EmployeeDto } from '../dto/employee-dto';
import { WithAuthGuardController } from '../../../http/controllers/with-auth-guard.controller';
import { PaginatedCollectionDto } from '../../../http/dto/paginated-collection.dto';
import ApiServiceException from '../../../exceptions/api-service.exception';

@Controller('employee')
export class EmployeeController extends WithAuthGuardController {
    constructor(private readonly employeeService: EmployeeService) {
        super();
    }

    @Post()
    async create(@Body() createEmployeeDto: CreateEmployeeDto) {
        const employee = await this.employeeService.create(createEmployeeDto);

        return this.wrapResponse(employee);
    }

    @Get()
    async findAll(): Promise<
        ResponseInterface<PaginatedCollectionDto<EmployeeDto>>
    > {
        const result = await this.employeeService.findAll();
        return this.wrapResponse(
            new PaginatedCollectionDto<EmployeeDto>(result),
        );
    }

    @Get(':id')
    async findOne(
        @Param('id') id: string,
    ): Promise<ResponseInterface<EmployeeDto>> {
        const result = await this.employeeService.findOne(+id);

        return this.wrapResponse(result);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateEmployeeDto: UpdateEmployeeDto,
    ) {
        try {
            const result = await this.employeeService.update(
                +id,
                updateEmployeeDto,
            );
            return this.wrapResponse(result);
        } catch (e) {
            if (e instanceof ApiServiceException) {
                const err = e as ApiServiceException;
                return this.wrapError(err.getApiError());
            }

            throw e;
        }
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.employeeService.remove(+id);
    }
}
