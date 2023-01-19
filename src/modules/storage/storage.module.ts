import { Module } from '@nestjs/common';
import { StorageService } from './services/storage.service';
import { StorageController } from './controllers/storage.controller';
import { StorageRepository } from './repositories/storage.repository';
import { S3Module } from '../s3/s3.module';

@Module({
    providers: [StorageService, StorageRepository],
    controllers: [StorageController],
    exports: [StorageService],
    imports: [S3Module],
})
export class StorageModule {}
