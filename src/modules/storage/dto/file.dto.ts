import { StoredFile } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
    @ApiProperty({
        type: 'number',
        example: 1,
        description: 'ID',
    })
    public id: number;

    @ApiProperty({
        type: 'string',
        description: 'Исходное навзание файла',
        example: 'image.png',
    })
    public fileName: string;

    @ApiProperty({
        type: 'string',
        description: 'URL до файла',
        example: 'http://example.com/path/to/image.jpg',
    })
    public path: string;

    @ApiProperty({
        type: 'number',
        description: 'Размер файла',
        example: '1024',
    })
    public size: string;

    constructor(file: StoredFile) {
        this.fileName = file.original_name;
        this.path = file.path;
        this.id = file.id;
        this.size = file.size.toString();
    }
}
