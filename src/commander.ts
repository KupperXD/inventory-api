import { CommandFactory } from 'nest-commander';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
    await CommandFactory.run(AppModule, ['warn', 'error']);
}

void bootstrap();
