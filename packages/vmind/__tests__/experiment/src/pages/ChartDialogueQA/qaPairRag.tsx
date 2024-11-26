/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React from 'react';
import { CustomPrompt, LLMManage, Model, RAGManage } from '../../../../../src/index';
import { Button, Input, Card } from '@arco-design/web-react';
import { knowledge } from './const';
import { isString, uniqArray } from '@visactor/vutils';
import './rag.scss';
const TextArea = Input.TextArea;

const globalVariables = (import.meta as any).env;
const qaRag = new RAGManage({
  // url: 'http://localhost:3333/api/viking_db/',
  url: 'http://10.90.34.164:3333/api/viking_db/',
  headers: {
    region: globalVariables.VITE_VIKING_DB_REGION,
    token: globalVariables.VITE_VIKING_DB_TOKEN
  },
  vikingdbName: globalVariables.VITE_VIKING_DB_NAME
});
const keyPathRag = new RAGManage({
  // url: 'http://localhost:3333/api/viking_db/',
  url: 'http://10.90.34.164:3333/api/viking_db/',
  headers: {
    region: globalVariables.VITE_VIKING_DB_REGION,
    token: globalVariables.VITE_VIKING_DB_KEY_PATH_TOKEN
  },
  vikingdbName: globalVariables.VITE_VIKING_DB_KEY_PATH_NAME
});
const llm = new LLMManage({
  url: globalVariables.VITE_GPT_URL,
  headers: {
    'api-key': globalVariables.VITE_GPT_KEY,
    Authorization: `Bearer ${globalVariables.VITE_GPT_KEY}`
  },
  maxTokens: 2048,
  model: Model.GPT_4o
});
const topKeyAtom = new CustomPrompt({} as any, {
  llm,
  promptTemplate: `# Background
You are a data visualization expert with an in-depth understanding of graphic grammar and visualization chart libraries such as d3, echarts, and ggplot2. You know how to use simple and straightforward language to help users understand visualization content. Now I have a new visualization frontend library called VChart. I will provide you with some knowledge content from VChart, and your task is to answer users' questions based on this knowledge content.
# Knowledge
\`\`\`
${JSON.stringify(knowledge)}
\`\`\`
# Requirement
1. Output the key value most relevant to the user's question.
2. Only need to output the key value.

# Example
User Input：
调整图例的布局，让两个图例行内布局
Output：
\`\`\`
{"key": 'legends'}
\`\`\``
});
export function QARag() {
  const [query, setQuery] = React.useState('');
  const [topK, setTopK] = React.useState(5);
  const [llmTopKey, setLLmTopKey] = React.useState('');
  const [qaResult, setQAResult] = React.useState<
    {
      scores: number;
      question: string;
      answer: string;
      explanation: string;
    }[]
  >([]);
  const [keyPathResult, setKeyPathResult] = React.useState<
    {
      scores: number;
      index: string;
      text: string;
      key: string;
    }[]
  >([]);
  const [topKeyResult, setTopKeyResult] = React.useState<
    {
      scores: number;
      text: string;
      key: string;
    }[]
  >([]);
  const getQaResult = React.useCallback(async () => {
    return await qaRag.rawRecall({
      indexName: 'betaV1',
      topK,
      text: query
    });
  }, [query, topK]);

  const getKeyPathResult = React.useCallback(
    async (chartList: string[] = []) => {
      return await keyPathRag.rawRecall({
        indexName: 'betaV1',
        topK,
        text: query,
        manualChunk: true,
        dslQuery: {
          op: 'and',
          conds: [
            { op: 'must', field: 'supportBar', conds: ['1'] },
            {
              op: 'must',
              field: 'chartType',
              conds: ['bar', ...chartList]
            }
          ]
        },
        sparseLogitAlpha: 0.2
      });
    },
    [query, topK]
  );

  const getTopKeyResult = React.useCallback(async () => {
    return await keyPathRag.rawRecall({
      indexName: 'betaV1',
      topK,
      text: query,
      manualChunk: true,
      dslQuery: {
        op: 'and',
        conds: [
          { op: 'must', field: 'supportBar', conds: ['1'] },
          {
            op: 'must',
            field: 'isTopKey',
            conds: ['1']
          }
        ]
      },
      sparseLogitAlpha: 0.2
    });
  }, [query, topK]);

  const handleQuery = React.useCallback(async () => {
    const [qaResult, topKeyRes] = await Promise.all([getQaResult(), getTopKeyResult()]);
    const llmTopKeyRes = await topKeyAtom.run({
      query
    });
    if (llmTopKeyRes && !llmTopKeyRes?.error) {
      setLLmTopKey(llmTopKeyRes?.key);
    } else {
      setLLmTopKey('');
    }
    if (qaResult && !qaResult?.error) {
      setQAResult(
        (qaResult?.result ?? []).map(item => {
          const attrs = isString(item.attrs) ? JSON.parse(item.attrs) : item.attrs;
          const { answer, content, keyList } = attrs;
          const jsonContent = JSON.parse(content);
          return {
            scores: item.scores,
            question: jsonContent.question,
            explanation: jsonContent.explanation,
            answer
          };
        })
      );
    } else {
      setQAResult([]);
    }
    if (topKeyRes && !topKeyRes?.error) {
      const validKeys = (topKeyRes?.result || [])?.map(item => {
        const attrs = isString(item.attrs) ? JSON.parse(item.attrs) : item.attrs;
        const { keyPath, content } = attrs;
        return {
          scores: item.scores,
          text: content,
          key: keyPath
        };
      });
      setTopKeyResult(validKeys);
      const keyPathRes = await getKeyPathResult(
        uniqArray([...validKeys.slice(0, 2).map(v => v.key), llmTopKeyRes?.key].filter(v => !!v))
      );
      if (keyPathRes && !keyPathRes?.error) {
        setKeyPathResult(
          (keyPathRes?.result ?? []).map(item => {
            const attrs = isString(item.attrs) ? JSON.parse(item.attrs) : item.attrs;
            const { keyPath, content, index } = attrs;
            return {
              scores: item.scores,
              index: index,
              text: content,
              key: keyPath
              // validKey
            };
          })
        );
      } else {
        setKeyPathResult([]);
      }
    } else {
      setTopKeyResult([]);
      setKeyPathResult([]);
    }
  }, [getKeyPathResult, getQaResult, getTopKeyResult, query]);

  return (
    <div style={{ padding: 20, paddingTop: 0 }}>
      <TextArea
        placeholder="Input Your Query"
        value={query}
        onChange={v => setQuery(v)}
        style={{ minHeight: 60, margin: 12, marginLeft: 0, background: 'transparent', border: '1px solid #eee' }}
      />
      <Button onClick={handleQuery} shape="round" type="primary" size="large">
        Get Rag Result
      </Button>
      <div>
        <div>LLM Result: Key: {llmTopKey}</div>
        <div className="recall-content">
          <div className="one-content">
            <div>QA Recall:</div>
            {qaResult.map((item, index) => (
              <Card key={index} className="qa-card">
                <div className="qa-div">
                  <span className="title">Score:</span>
                  <span>{item.scores.toFixed(2)}</span>
                </div>
                <div className="qa-div">
                  <div className="title">Question:</div>
                  <span>{item.question}</span>
                </div>
                <div className="qa-div">
                  <div className="title">Explanation:</div>
                  <span>{item.explanation}</span>
                </div>
                <div className="qa-div">
                  <div className="title">Answer:</div>
                  <span>{item.answer}</span>
                </div>
              </Card>
            ))}
          </div>
          <div className="one-content">
            <div>Top Key Recall:</div>
            {topKeyResult.map((item, index) => (
              <Card key={index} className="qa-card">
                <div className="qa-div">
                  <span className="title">Score:</span>
                  <span>{item.scores.toFixed(2)}</span>
                </div>
                <div className="qa-div">
                  <div className="title">content:</div>
                  <span>{item.text}</span>
                </div>
                <div className="qa-div">
                  <div className="title">key:</div>
                  <span>{item.key}</span>
                </div>
              </Card>
            ))}
          </div>
          <div className="one-content">
            <div>KeyPath Recall:</div>
            {keyPathResult.map((item, index) => (
              <Card key={index} className="qa-card">
                <div className="qa-div">
                  <span className="title">Score:</span>
                  <span>{item.scores.toFixed(2)}</span>
                </div>
                <div className="qa-div">
                  <div className="title">content:</div>
                  <span>{item.text}</span>
                </div>
                <div className="qa-div">
                  <div className="title">key:</div>
                  <span>{item.key}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
