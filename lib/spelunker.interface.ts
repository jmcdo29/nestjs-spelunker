import { Type } from '@nestjs/common';

export interface SpelunkedTree {
  name: string;
  imports: string[];
  exports: string[];
  controllers: string[];
  providers: Record<string, SpelunkedProvider>;
}

interface SpelunkedProvider {
  method: 'value' | 'factory' | 'class' | 'standard';
  injections?: string[];
}

export type ProviderType = 'value' | 'factory' | 'class';

export interface DebuggedTree {
  name: string;
  imports: string[];
  providers: Array<DebuggedProvider & { type: ProviderType }>;
  controllers: DebuggedProvider[];
  exports: DebuggedExports[];
}

export interface DebuggedProvider {
  name: string;
  dependencies: string[];
}

export interface DebuggedExports {
  name: string;
  type: 'provider' | 'module';
}

export interface CustomProvider {
  provide: Type<any> | string | symbol;
  useClass?: Type<any>;
  useValue?: any;
  useFactory?: (...args: any[]) => any;
  useExisting?: Type<any>;
  inject?: any[];
}
