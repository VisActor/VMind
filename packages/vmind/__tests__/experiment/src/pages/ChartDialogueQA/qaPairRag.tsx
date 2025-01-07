/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React from 'react';
import axios from 'axios';
import { Input, Card, Message, Checkbox, Select, Tooltip, Modal, Form } from '@arco-design/web-react';
import './rag.scss';
import {
  IconDelete,
  IconLoading,
  IconRobot,
  IconSend,
  IconThumbDownFill,
  IconThumbUpFill,
  IconUser
} from '@arco-design/web-react/icon';
import VChart from '@visactor/vchart';
import { isArray } from '@visactor/vutils';
import { VChartSpec } from '../../../../../src';

const { Option } = Select;
const FormItem = Form.Item;
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
const vchartSpecAtom = new VChartSpec({ spec: baseSpec }, {});
export function QARag() {
  const vchartInstance = React.useRef<any>(null);
  const [query, setQuery] = React.useState('');
  const [ragOption, setRagOptions] = React.useState<{
    type: 'qa' | 'code';
    useTopKey: boolean;
    topK: number;
    useSpec: boolean;
    useQueryTransfer: boolean;
  }>({
    topK: 5,
    useTopKey: true,
    useSpec: false,
    type: 'qa',
    useQueryTransfer: true
  });
  const [llmTopKey, setLLmTopKey] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [spec, setSpec] = React.useState<any>(baseSpec);
  const [dialog, setDialog] = React.useState<
    {
      role: string;
      content: string | string[];
      res?: any;
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
      answer?: string;
      key: string;
    }[]
  >([]);
  const [feedbackVisible, setFeedbackVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [form] = Form.useForm();
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const currentFeedbackIndex = React.useRef<number>(0);

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
    let res: any;
    try {
      res = await axios(`${url}queryKeyPath`, {
        method: 'POST',
        data: {
          chartType: 'bar',
          query,
          spec,
          ...ragOption
        }
      });
    } catch (e: any) {
      console.error(e);
      setLoading(false);
      setDialog([
        ...newDialg,
        {
          role: 'assistant',
          content: 'Some thing wrong with network!',
          res: {
            query,
            spec
          }
        }
      ]);
      return;
    }
    console.log('res: ', res.data);
    const { keyPathRes = [], qaRes = [], topKeys = [], dslRes, parentKeyPath, aliasKeyPath, error } = res?.data;

    vchartSpecAtom.updateContext(
      {
        spec: spec,
        appendSpec: {
          spec: dslRes
        }
      },
      true
    );
    const { spec: newSpec } = await vchartSpecAtom.run();
    console.log('newSpec', newSpec);
    setSpec(newSpec);
    setLoading(false);
    if (error) {
      setDialog([
        ...newDialg,
        {
          role: 'assistant',
          content: error,
          res: {
            query,
            ...res.data,
            spec: newSpec
          }
        }
      ]);
      return;
    }
    setDialog([
      ...newDialg,
      {
        role: 'assistant',
        content: JSON.stringify(
          {
            keyPath: parentKeyPath,
            aliasKeyPath: aliasKeyPath,
            spec: dslRes
          },
          null,
          2
        ),
        res: {
          query,
          ...res.data,
          spec: newSpec
        }
      }
    ]);
    setQAResult(qaRes);
    setKeyPathResult(keyPathRes);
    setLLmTopKey(topKeys);
  }, [dialog, query, spec, ragOption]);

  const handleFeedback = React.useCallback(
    (type: 'up' | 'down', index: number) => {
      if (type === 'up') {
        Message.success('Thansk for your feedback!');
        const currentDialog = dialog[index];
        axios(`${url}feedback`, {
          method: 'POST',
          data: {
            type,
            ragOption,
            ...currentDialog?.res
          }
        });
      } else {
        currentFeedbackIndex.current = index;
        setFeedbackVisible(true);
      }
    },
    [dialog, ragOption]
  );

  const handleDownFeedback = React.useCallback(() => {
    setConfirmLoading(true);
    form
      .validate()
      .then(res => {
        const currentDialog = dialog[currentFeedbackIndex.current];
        axios(`${url}feedback`, {
          method: 'POST',
          data: {
            type: 'down',
            ragOption,
            ...currentDialog?.res,
            ...res
          }
        });
      })
      .finally(() => {
        setConfirmLoading(false);
        setFeedbackVisible(false);
        Message.success('Thansk for your feedback!');
      });
  }, [dialog, form, ragOption]);

  React.useEffect(() => {
    dialogRef.current?.scrollTo({
      top: dialogRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [dialog]);

  React.useEffect(() => {
    try {
      if (spec && !vchartInstance.current) {
        (document.getElementById('chart') as HTMLElement).innerHTML = '';
        console.log('new vchart', spec);

        const chart = new VChart(spec, {
          dom: document.getElementById('chart') as HTMLElement
        });
        chart.renderAsync();

        vchartInstance.current = chart;
      } else if (spec && vchartInstance.current) {
        vchartInstance.current.updateSpecSync(spec);
      }
    } catch (e) {
      console.error(e);
    }
  }, [spec, vchartInstance]);

  return (
    <div className="rag-panel">
      <Modal
        title="Add User"
        visible={feedbackVisible}
        onOk={handleDownFeedback}
        confirmLoading={confirmLoading}
        onCancel={() => setFeedbackVisible(false)}
      >
        <Form
          {...{
            labelCol: {
              span: 4
            },
            wrapperCol: {
              span: 20
            }
          }}
          form={form}
          labelCol={{
            style: { flexBasis: 150 }
          }}
          wrapperCol={{
            style: { flexBasis: 'calc(100% - 160px)' }
          }}
        >
          <FormItem label="Type" required field="wrongType" rules={[{ required: true }]}>
            <Select options={['DSL', 'VChart Render', 'Not sure']} />
          </FormItem>
          <FormItem label="TopKeyPath" field="topKeyAnswer" rules={[{ required: true }]}>
            <Input placeholder="" />
          </FormItem>
          <FormItem label="Answer DSL" field="keyPathAnswer">
            <Input placeholder="" />
          </FormItem>
        </Form>
      </Modal>
      <div className="rag-options">
        <Select
          style={{ width: 200, marginRight: 12 }}
          value={ragOption.type}
          onChange={v => setRagOptions({ ...ragOption, type: v })}
        >
          <Option value="qa">KeyPath of QA</Option>
          <Option value="code">KeyPath of Code</Option>
        </Select>
        <Select
          style={{ width: 200, marginRight: 12 }}
          prefix="Top K"
          value={ragOption.topK}
          onChange={v => setRagOptions({ ...ragOption, topK: v })}
        >
          <Option value={3}>3</Option>
          <Option value={4}>4</Option>
          <Option value={5}>5</Option>
          <Option value={6}>6</Option>
          <Option value={7}>7</Option>
          <Option value={8}>8</Option>
          <Option value={9}>9</Option>
          <Option value={10}>10</Option>
        </Select>
        <Checkbox
          checked={ragOption.useQueryTransfer}
          onChange={v => setRagOptions({ ...ragOption, useQueryTransfer: v })}
        >
          Use Query Transfer(问题黑话转译)
        </Checkbox>
        <Checkbox checked={ragOption.useSpec} onChange={v => setRagOptions({ ...ragOption, useSpec: v })}>
          Use Spec(传递关联的spec给大模型)
        </Checkbox>
      </div>
      <div className="rag-container">
        <div className="vchart-container">
          <div id="chart" />
          <div className="log">
            {ragOption.useTopKey && <div>TOP KEY RESULT: {JSON.stringify(llmTopKey)}</div>}
            <div className="recall-content">
              <div className="one-content">
                <div>QA Recall:</div>
                {qaResult && qaResult.length
                  ? qaResult.map((item, index) => (
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
                          <span>{`${item.answer}`}</span>
                        </div>
                      </Card>
                    ))
                  : null}
              </div>

              <div className="one-content">
                <div>KeyPath Recall:</div>
                {keyPathResult && keyPathResult.length
                  ? keyPathResult.map((item, index) => (
                      <Card key={index} className="qa-card">
                        <div className="qa-div">
                          <span className="title">Score:</span>
                          <span>{item.scores.toFixed(2)}</span>
                        </div>
                        <div className="qa-div">
                          <div className="title">content:</div>
                          <span>{item.text}</span>
                        </div>
                        {ragOption.type === 'qa' ? (
                          <div className="qa-div">
                            <div className="title">Answer:</div>
                            <span>{`${item.answer}`}</span>
                          </div>
                        ) : null}
                        <div className="qa-div">
                          <div className="title">key:</div>
                          <span>{item.key}</span>
                        </div>
                      </Card>
                    ))
                  : null}
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
            <Tooltip content="Reset ALL">
              <IconDelete
                style={{
                  cursor: 'pointer',
                  color: '#999',
                  fontSize: 16,
                  alignSelf: 'center'
                }}
                onClick={() => {
                  setDialog([
                    {
                      role: 'assistant',
                      content: 'Hello! How can I help you today?'
                    }
                  ]);
                  setSpec(baseSpec);
                  setKeyPathResult([]);
                  setQAResult([]);
                  setQuery('');
                }}
              />
            </Tooltip>
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
                    {isArray(content) ? (
                      content.map(v => (
                        <pre key={v}>
                          <code>{v}</code>
                        </pre>
                      ))
                    ) : (
                      <pre>
                        <code>{content}</code>
                      </pre>
                    )}
                  </div>
                  <div
                    className="feedback"
                    // style={{ visibility: index === dialog.length - 1 && index > 0 ? 'visible' : 'hidden' }}
                  >
                    <IconThumbUpFill style={{ color: '#28a745' }} onClick={() => handleFeedback('up', index)} />
                    <IconThumbDownFill style={{ color: '#dc3545' }} onClick={() => handleFeedback('down', index)} />
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
    </div>
  );
}
