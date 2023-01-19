import {
    Controller,
    HttpCode,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { StorageService } from '../services/storage.service';
import { FileDto } from '../dto/file.dto';
import ApiServiceException from '../../../exceptions/api-service.exception';
import FileUploadInterceptor from '../interceptors/file-upload.interceptor';
import JwtAuthenticationGuard from '../../auth/guards/jwt-authentication.guard';
import ApiController from '../../../http/controllers/api.controller';
import {
    ApiBody,
    ApiConsumes,
    ApiExtraModels,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    getSchemaPath,
} from '@nestjs/swagger';
import { FileExtensionValidator } from '../pipes/parse-file.validator';
import { FileValidationException } from '../exceptions/file-validation.exception';
import { ErrorDto } from 'src/http/dto/errors/error.dto';
import { ErrorResponseInterface } from '../../../http/errors/interfaces/error-response.interface';

@Controller('Хранилище')
@ApiTags('storage')
export class StorageController extends ApiController {
    constructor(private readonly storageService: StorageService) {
        super();
    }

    @UseGuards(JwtAuthenticationGuard)
    @Post('upload-file')
    @UseInterceptors(
        FileUploadInterceptor({
            fieldName: 'file',
        }),
    )
    @ApiOperation({
        summary: 'Загрузка файла',
        description: 'Загружаем файл',
    })
    @HttpCode(200)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiExtraModels(FileDto)
    @ApiExtraModels(ErrorDto)
    @ApiOkResponse({
        schema: {
            oneOf: [
                {
                    description: 'Загруженный файл',
                    properties: {
                        response: {
                            type: 'object',
                            $ref: getSchemaPath(FileDto),
                        },
                    },
                },
                {
                    description: 'Ошибка',
                    properties: {
                        error: {
                            type: 'object',
                            $ref: getSchemaPath(ErrorDto),
                        },
                    },
                },
            ],
        },
    })
    async uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileExtensionValidator({
                        allowedMimeType:
                            StorageService.getAllowedExtensionType(),
                    }),
                    new MaxFileSizeValidator({
                        maxSize: StorageService.MAX_FILE_SIZE,
                    }),
                ],
                fileIsRequired: true,
                exceptionFactory: (error) => {
                    throw new FileValidationException(error);
                },
            }),
        )
        uploadedFile: Express.Multer.File,
    ) {
        try {
            const file = await this.storageService.uploadedFile(uploadedFile);

            return this.wrapResponse(new FileDto(file));
        } catch (e) {
            if (e instanceof ApiServiceException) {
                return this.wrapError(e.getApiError());
            }

            throw e;
        }
    }
}
