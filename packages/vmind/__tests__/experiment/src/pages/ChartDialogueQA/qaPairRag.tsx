/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React from 'react';
import axios from 'axios';
import { Input, Card } from '@arco-design/web-react';
import './rag.scss';
import {
  IconLoading,
  IconRobot,
  IconSend,
  IconThumbDownFill,
  IconThumbUpFill,
  IconUser
} from '@arco-design/web-react/icon';
import VChart from '@visactor/vchart';
import { isArray } from '@visactor/vutils';

const globalVariables = (import.meta as any).env;
const url = globalVariables.VITE_VCHART_EDITOR_URL || 'http://localhost/';
const baseSpec = {
  type: 'bar',
  data: [
    {
      id: 'barData',
      values: [
        { type: 'Autocracies', year: '1930', value: 129 },
        { type: 'Autocracies', year: '1940', value: 133 },
        { type: 'Autocracies', year: '1950', value: 130 },
        { type: 'Autocracies', year: '1960', value: 126 },
        { type: 'Autocracies', year: '1970', value: 117 },
        { type: 'Autocracies', year: '1980', value: 114 },
        { type: 'Autocracies', year: '1990', value: 111 },
        { type: 'Autocracies', year: '2000', value: 89 },
        { type: 'Autocracies', year: '2010', value: 80 },
        { type: 'Autocracies', year: '2018', value: 80 },
        { type: 'Democracies', year: '1930', value: 22 },
        { type: 'Democracies', year: '1940', value: 13 },
        { type: 'Democracies', year: '1950', value: 25 },
        { type: 'Democracies', year: '1960', value: 29 },
        { type: 'Democracies', year: '1970', value: 38 },
        { type: 'Democracies', year: '1980', value: 41 },
        { type: 'Democracies', year: '1990', value: 57 },
        { type: 'Democracies', year: '2000', value: 87 },
        { type: 'Democracies', year: '2010', value: 98 },
        { type: 'Democracies', year: '2018', value: 99 }
      ]
    }
  ],
  xField: ['year', 'type'],
  yField: 'value',
  seriesField: 'type',
  legends: {
    visible: true,
    orient: 'top',
    position: 'start'
  }
};
export function QARag() {
  const [query, setQuery] = React.useState('');
  const [topK, setTopK] = React.useState(5);
  const [llmTopKey, setLLmTopKey] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [spec, setSpec] = React.useState<any>(baseSpec);
  const [dialog, setDialog] = React.useState<
    {
      role: string;
      content: string | string[];
    }[]
  >([
    {
      role: 'assistant',
      content: 'Hello! How can I help you today?'
    }
  ]);
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
  const [queryRes, setQueryRes] = React.useState<any>({});
  const dialogRef = React.useRef<HTMLDivElement>(null);

  const handleQuery = React.useCallback(async () => {
    const newDialg = [
      ...dialog,
      {
        role: 'user',
        content: query
      }
    ];
    setQuery('');
    setDialog(newDialg);
    setLoading(true);
    const res = await axios(`${url}queryKeyPath`, {
      method: 'POST',
      data: {
        chartType: 'bar',
        query,
        topK
      }
    });
    console.log('res: ', res.data);
    setQueryRes(res.data);
    const { keyPathRes = [], qaRes = [], topKeys = [], dslRes, nerPrompt, parentKeyPath, error } = res.data;
    // @todo @xile611 spec update
    setLoading(false);
    if (error) {
      setDialog([...newDialg, { role: 'assistant', content: error }]);
      return;
    }
    setDialog([
      ...newDialg,
      {
        role: 'assistant',
        content: [
          JSON.stringify({
            keyPath: parentKeyPath
          }),
          JSON.stringify({
            spec: dslRes
          })
        ]
      }
    ]);
    setQAResult(qaRes);
    setKeyPathResult(keyPathRes);
    setLLmTopKey(topKeys);
  }, [dialog, query, topK]);

  const handleFeedback = React.useCallback(
    (type: 'up' | 'down') => {
      axios(`${url}feedback`, {
        method: 'POST',
        data: {
          query,
          type,
          queryRes
        }
      });
    },
    [query, queryRes]
  );

  React.useEffect(() => {
    dialogRef.current?.scrollTo({
      top: dialogRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [dialog]);

  React.useEffect(() => {
    if (spec) {
      (document.getElementById('chart') as HTMLElement).innerHTML = '';
      const chart = new VChart(spec, {
        dom: document.getElementById('chart') as HTMLElement
      });
      chart.renderAsync();
    }
  }, [spec]);

  return (
    <div className="rag-container">
      <div className="vchart-container">
        <div id="chart" />
        <div className="log">
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
      <div className="query-container">
        <div className="query-input">
          <Input
            placeholder="Input Your Query"
            value={query}
            onChange={v => setQuery(v)}
            onPressEnter={handleQuery}
            style={{ minHeight: 40, margin: 12, marginLeft: 0, background: '#fff', border: '1px solid #eee' }}
            suffix={<IconSend onClick={handleQuery} />}
          />
        </div>
        <div className="dialog" ref={dialogRef}>
          {dialog.map((item, index) => {
            const { role, content } = item;
            if (role === 'user') {
              return (
                <div key={index} className="user dialog-item">
                  <IconUser style={{ width: 25, height: 25, marginLeft: 4 }} />
                  <div className="user-content diaglog-content">{content}</div>
                </div>
              );
            }
            return (
              <div key={index} className="assistant dialog-item">
                <IconRobot style={{ width: 25, height: 25, marginRight: 4 }} />
                <div className="assistant-content diaglog-content">
                  {isArray(content) ? content.map(v => <div key={v}>{v}</div>) : content}
                </div>
                <div
                  className="feedback"
                  style={{ visibility: index === dialog.length - 1 && index > 0 ? 'visible' : 'hidden' }}
                >
                  <IconThumbUpFill style={{ color: '#28a745' }} onClick={() => handleFeedback('up')} />
                  <IconThumbDownFill style={{ color: '#dc3545' }} onClick={() => handleFeedback('down')} />
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="assistant dialog-item">
              <IconRobot style={{ width: 25, height: 25, marginTop: 4, marginRight: 4 }} />
              <div className="assistant-content diaglog-content">
                <IconLoading />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
