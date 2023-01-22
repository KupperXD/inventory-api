import { Employee, InventoryItem, StoredFile } from '@prisma/client';

export interface InventoryItemWithRelationsType extends InventoryItem {
    employee: Employee | null;
    photo: StoredFile | null;
}
