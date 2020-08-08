import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SpelunkerModule } from '../lib/';
import { AppModule } from './app/app.module';
import { debugOutput, exploreOutput } from './fixtures/output';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
  });

  it('should allow the SpelunkerModule to explore', () => {
    const output = SpelunkerModule.explore(app);
    expect(output).toEqual(exploreOutput);
  });

  it('should allow the SpelunkerModule to debug', () => {
    const output = SpelunkerModule.debug(AppModule);
    expect(output).toEqual(debugOutput);
  });
});
