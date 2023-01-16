import { StoredFile } from '@prisma/client';

export class FileDto {
    public id: number;
    public fileName: string;
    public path: string;
    public size: string;

    constructor(file: StoredFile) {
        this.fileName = file.name;
        this.path = file.path;
        this.id = file.id;
        this.size = file.size.toString();
    }
}
