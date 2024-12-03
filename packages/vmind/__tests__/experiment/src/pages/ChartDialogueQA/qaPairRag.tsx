/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React from 'react';
import axios from 'axios';
import { Button, Input, Card } from '@arco-design/web-react';
import './rag.scss';
const TextArea = Input.TextArea;

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

  const handleQuery = React.useCallback(async () => {
    const res = await axios('http://10.90.34.164:7777/queryKeyPath', {
      method: 'POST',
      data: {
        chartType: 'bar',
        query,
        topK
      }
    });
    const { keyPathRes = [], qaRes = [], topKeys = [] } = res.data;
    setQAResult(qaRes);
    setKeyPathResult(keyPathRes);
    setLLmTopKey(topKeys);
  }, [query, topK]);

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
        <div>LLM Result: Key: {JSON.stringify(llmTopKey)}</div>
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
