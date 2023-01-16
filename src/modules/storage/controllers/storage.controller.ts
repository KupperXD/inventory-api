import {
    Controller,
    Get,
    Param,
    Post,
    Res,
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

@Controller('storage')
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
    async uploadFile(@UploadedFile() uploadedFile: Express.Multer.File) {
        try {
            console.log('upload file', {
                uploadedFile,
            });
            const file = await this.storageService.uploadedFile(uploadedFile);

            return this.wrapResponse(new FileDto(file));
        } catch (e) {
            if (e instanceof ApiServiceException) {
                return this.wrapError(e.getApiError());
            }

            throw e;
        }
    }

    @Get('/:filename')
    async getFile(@Param('filename') filename: string, @Res() res: any) {
        res.sendFile(filename, {
            root: 'storage/',
        });
    }
}
