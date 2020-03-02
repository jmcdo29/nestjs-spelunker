import { createMock } from '@golevelup/ts-jest';
import { INestApplication, LoggerService } from '@nestjs/common';
import { SpelunkerModule } from '../lib/spelunker';
import { AppModule } from './app/app.module';
import { NestFactory } from '@nestjs/core';
import { exploreOutput } from './fixtures/output';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
  });

  it('should allow the SpelunkerModule to explore', () => {
    const mockLogger: LoggerService = createMock<LoggerService>();
    SpelunkerModule.explore(app, mockLogger);
    expect(mockLogger.log).toBeCalledTimes(1);
    expect(mockLogger.log).toBeCalledWith(exploreOutput);
  });
});
