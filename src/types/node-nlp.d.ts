declare module 'node-nlp' {
  export interface NlpManagerOptions {
    languages?: string[];
    forceNER?: boolean;
    [key: string]: unknown;
  }

  export interface NlpProcessResult {
    answer?: string;
    intent?: string;
    score?: number;
    classifications?: Array<{ intent: string; score: number }>;
    [key: string]: unknown;
  }

  export class NlpManager {
    constructor(opts?: NlpManagerOptions);
    addDocument(lang: string, utterance: string, intent: string): void;
    addAnswer(lang: string, intent: string, answer: string): void;
    train(): Promise<void>;
    process(lang: string, utterance: string): Promise<NlpProcessResult>;
  }
}