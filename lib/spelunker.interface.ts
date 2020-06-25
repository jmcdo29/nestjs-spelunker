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
