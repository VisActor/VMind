export interface IRAGOptions {
  /** url of vector db */
  url: string;
  /** viking db name */
  vikingdbName: string;
  headers?: HeadersInit;
  method?: 'POST' | 'GET';
}

export interface RecallOptions {
  indexName: string;
  topK: number;
  subIndex?: string;
  dslQuery?: Record<string, any>;
  isRandomRecall?: boolean;
  vector?: number[];
  sparseVector?: string[];
  sparseLogitAlpha?: number;
  missAsEmpty?: boolean;
  /** need get chunk manually */
  manualChunk?: boolean;
}

export interface RecallResult {
  scores: number;
  labelLower64: number;
  labelUpper64: number;
  attrs: string;
  extraInfos: string;
}

export interface RawEmbeddingOptions {
  rawDatas: { text: string }[];
}

export interface RawEmbdeddingResult {
  vector?: number[];
  sparseVector?: string[];
  error?: string;
}

export type RawRecallOptions = Omit<RecallOptions, 'vector' | 'sparseVector'> & {
  text: string;
};
