import { Prisma, PrismaClient } from '@prisma/client';
import {
    INestApplication,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';

export class PrismaService
    extends PrismaClient<
        Prisma.PrismaClientOptions,
        'error' | 'query' | 'warn' | 'info'
    >
    implements OnModuleInit, OnModuleDestroy
{
    constructor() {
        super({
            log: [],
        });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close();
        });
    }
}
