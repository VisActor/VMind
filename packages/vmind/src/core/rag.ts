import { merge } from '@visactor/vutils';
import axios from 'axios';
import type { IRAGOptions, RecallOptions, RawEmbeddingOptions, RawRecallOptions, RecallResult } from '../types/rag';

/** RAG Manager Class */
export class RAGManage {
  options: IRAGOptions;

  constructor(options: IRAGOptions) {
    this.options = merge({}, this.getDefaultOptions(), options);
  }

  getDefaultOptions(): IRAGOptions {
    return {
      url: '',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      vikingdbName: ''
    };
  }

  updateOptions(options: IRAGOptions) {
    this.options = merge({}, this.options, options);
  }

  async recall(options: RecallOptions): Promise<{ error?: string; result?: RecallResult[] }> {
    const { url, headers, vikingdbName, method } = this.options;
    const {
      indexName,
      subIndex = 'default',
      topK,
      dslQuery,
      isRandomRecall,
      vector,
      missAsEmpty,
      sparseVector,
      sparseLogitAlpha,
      manualChunk
    } = options;
    try {
      const res = await axios(url + 'recall', {
        method,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        headers: headers as any,
        data: {
          vikingdb_name: vikingdbName,
          index_name: indexName,
          sub_index: subIndex,
          topk: topK,
          dsl_query: JSON.stringify(dslQuery),
          is_random_recall: isRandomRecall,
          vector,
          sparse_vector: (sparseVector ?? [])
            .map(item => {
              // 使用正则表达式解析字符串
              const match = item.match(/\('(.+)', ([\d.]+)\)/);
              if (match) {
                return [match[1], parseFloat(match[2])];
              }
              return null;
            })
            .filter(item => item !== null),
          sparse_logit_alpha: sparseLogitAlpha,
          miss_as_empty: missAsEmpty
          // manualChunk
        }
      }).then(response => response.data);

      if (res.error) {
        console.error(res.error);
        return {
          error: res.error
        };
      }
      return res;
    } catch (err: any) {
      console.error(err);
      return {
        error: err
      };
    }
  }

  async rawEmbedding(options: RawEmbeddingOptions) {
    const { url, headers, method, vikingdbName } = this.options;
    const { rawDatas } = options;
    try {
      const res = await axios(url + 'raw_embedding', {
        method,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        headers: headers as any,
        data: {
          vikingdb_prefix: vikingdbName,
          raw_datas: rawDatas
        }
      }).then(response => response.data);

      if (res.error) {
        console.error(res.error);
        return {
          error: res.error
        };
      }
      return {
        vector: res?.embeddings,
        sparseVector: res?.sparse_embeddings
      };
    } catch (err: any) {
      console.error(err);
      return {
        error: err
      };
    }
  }

  async rawRecall(options: RawRecallOptions) {
    const result = await this.rawEmbedding({
      ...options,
      rawDatas: [{ text: options.text }]
    });
    if (!result?.error) {
      const { vector = [], sparseVector = [] } = result;
      return await this.recall({
        ...options,
        vector: vector[0],
        sparseVector: sparseVector[0]
      });
    }
    return {
      error: result.error,
      result: [] as RecallResult[]
    };
  }
}
