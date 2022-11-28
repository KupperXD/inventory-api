import { repl } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
    await repl(AppModule);
}

void bootstrap();
