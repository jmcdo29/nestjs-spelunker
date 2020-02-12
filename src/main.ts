import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExplorerModule } from './explorer/explorer.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  ExplorerModule.explore(app);
  // await app.listen(3000);
}
bootstrap();
