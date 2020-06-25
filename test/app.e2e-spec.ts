import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SpelunkerModule } from '../lib/';
import { AppModule } from './app/app.module';
import { exploreOutput } from './fixtures/output';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
  });

  it('should allow the SpelunkerModule to explore', () => {
    const output = SpelunkerModule.explore(app);
    expect(output).toEqual(exploreOutput);
  });
});
