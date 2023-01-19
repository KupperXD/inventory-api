import { Injectable } from '@nestjs/common';
import { StorageRepository } from '../repositories/storage.repository';
import { StoredFile } from '@prisma/client';
import ApiServiceException from '../../../exceptions/api-service.exception';
import UnknownError from '../../../http/errors/unknown.error';
import { S3Service } from '../../s3/services/s3.service';

@Injectable()
export class StorageService {
    constructor(
        private readonly storageRepository: StorageRepository,
        private readonly s3service: S3Service,
    ) {}

    static MAX_FILE_SIZE = Math.pow(1024, 2);

    static getAllowedExtensionImageType(): string[] {
        return ['.jpeg', '.png', '.jpg'];
    }

    static getAllowedExtensionType(): string[] {
        return [...StorageService.getAllowedExtensionImageType()];
    }

    public async uploadedFile(
        uploadedFile: Express.Multer.File,
    ): Promise<StoredFile> {
        try {
            const s3result = await this.s3service.uploadPublicFile(
                uploadedFile.buffer,
                uploadedFile.originalname,
            );

            const model = await this.storageRepository.create({
                name: s3result.Key,
                size: uploadedFile.size,
                mime: uploadedFile.mimetype,
                path: s3result.Location,
                original_name: uploadedFile.originalname,
            });

            if (!model) {
                throw new ApiServiceException(
                    new UnknownError('Не удалось сохранить файл в бд.'),
                );
            }

            return model;
        } catch (e) {
            if (e instanceof ApiServiceException) {
                throw e;
            }
        }
    }
}
