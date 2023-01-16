import { Module } from '@nestjs/common';
import { StorageService } from './services/storage.service';
import { StorageController } from './controllers/storage.controller';
import { StorageRepository } from './repositories/storage.repository';

@Module({
    providers: [StorageService, StorageRepository],
    controllers: [StorageController],
    exports: [StorageService],
})
export class StorageModule {}
