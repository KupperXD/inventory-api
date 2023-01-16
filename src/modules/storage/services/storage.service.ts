import { Injectable } from '@nestjs/common';
import { StorageRepository } from '../repositories/storage.repository';
import { StoredFile } from '@prisma/client';
import ApiServiceException from '../../../exceptions/api-service.exception';
import UnknownError from '../../../http/errors/unknown.error';

@Injectable()
export class StorageService {
    constructor(private readonly storageRepository: StorageRepository) {}

    public async uploadedFile(
        uploadedFile: Express.Multer.File,
    ): Promise<StoredFile> {
        console.log('service', {
            uploadedFile,
        });
        const model = await this.storageRepository.create({
            name: uploadedFile.filename,
            size: uploadedFile.size,
            mime: uploadedFile.mimetype,
            path: uploadedFile.path,
            original_name: uploadedFile.originalname,
        });

        if (!model) {
            throw new ApiServiceException(
                new UnknownError('Не удалось сохранить файл в бд.'),
            );
        }

        return model;
    }
}
