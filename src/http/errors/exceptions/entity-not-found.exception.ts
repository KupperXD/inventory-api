import { NotFoundException } from '@nestjs/common';

export class EntityNotFoundException extends NotFoundException {
    constructor(id: number) {
        super(`Entity with id ${id} not found`);
    }
}
