import { Injectable, mixin, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';

interface FilesInterceptorOptions {
    fieldName: string;
    path?: string;
}

function FileUploadInterceptor(options: FilesInterceptorOptions) {
    @Injectable()
    class Interceptor implements NestInterceptor {
        fileInterceptor: NestInterceptor;

        constructor(
            configService: ConfigService<EnvironmentVariablesInterface>,
        ) {
            const filesDestination = configService.get(
                'UPLOADED_FILES_DESTINATION',
            );

            const destination = `${filesDestination}${options.path ?? ''}`;

            const multerOptions: MulterOptions = {
                storage: diskStorage({
                    destination,
                    filename(
                        req: Express.Request,
                        file: Express.Multer.File,
                        callback: (
                            error: Error | null,
                            filename: string,
                        ) => void,
                    ) {
                        callback(null, file.originalname);
                    },
                }),
            };

            this.fileInterceptor = new (FileInterceptor(
                options.fieldName,
                multerOptions,
            ))();
        }

        intercept(...args: Parameters<NestInterceptor['intercept']>) {
            return this.fileInterceptor.intercept(...args);
        }
    }

    return mixin(Interceptor);
}

export default FileUploadInterceptor;
