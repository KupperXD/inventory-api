import { FileValidator, Injectable } from '@nestjs/common';
import * as path from 'path';

type ValidationOptions = {
    allowedMimeType: string[];
};

@Injectable()
export class FileExtensionValidator extends FileValidator<ValidationOptions> {
    constructor(public readonly validationOptions: ValidationOptions) {
        super(validationOptions);
    }

    isValid(file?: Express.Multer.File): boolean | Promise<boolean> {
        const ext = path.extname(file.originalname).toLowerCase();

        return this.validationOptions.allowedMimeType.includes(ext);
    }

    buildErrorMessage(): string {
        return `Недопустимый тип файла. Можно загружать ${this.getAllowedExtensionsRule()}`;
    }

    private getAllowedExtensionsRule(): string {
        return this.validationOptions.allowedMimeType.join(', ');
    }
}
