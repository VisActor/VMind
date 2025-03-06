/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React from 'react';
import axios from 'axios';
import { Input, Tooltip, Button, Message } from '@arco-design/web-react';
import './rag.scss';
import { IconDelete, IconLoading, IconSend, IconThumbDownFill, IconUser } from '@arco-design/web-react/icon';
import VChart from '@visactor/vchart';
import { isArray } from '@visactor/vutils';
import { VChartSpec } from '../../../../../src';
import {
  baseFunnel,
  baseGroupBar,
  baseLine,
  baseRadar,
  baseSankey,
  baseScatter,
  baseStackArea,
  baseWordcloud,
  duelAxisChart,
  multipleLine,
  pieChart,
  roseChart,
  stackBar
} from '../../data/editorData';
import { JSONEditor } from './specEditor';
import { Logo } from './logo';

const globalVariables = (import.meta as any).env;
const url = globalVariables.VITE_VCHART_EDITOR_URL || 'http://localhost/';
const feedbackUrl = globalVariables.VITE_VCHART_EDITOR_FEEDBACK || url;
const vmindKey = globalVariables.VITE_VMIND_KEY;
const demoData = [
  {
    name: '基础线图',
    spec: baseLine,
    src: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vchart/preview/line-chart/basic-line.png'
  },
  {
    name: '多系列折线图',
    spec: multipleLine,
    src: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vchart/preview/line-chart/null-value-line.png'
  },
  {
    name: '堆积面积图',
    spec: baseStackArea,
    src: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vchart/preview/area-chart/stacked-area.png'
  },
  {
    name: '分组柱图',
    spec: baseGroupBar,
    src: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vchart/preview/bar-chart/group-column.png'
  },
  {
    name: '堆积柱图',
    spec: stackBar,
    src: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vchart/preview/bar-chart/stack-column.png'
  },
  {
    name: '双轴图',
    spec: duelAxisChart,
    src: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vchart/preview/combination/dual-axis.png'
  },
  {
    name: '饼图',
    spec: pieChart,
    src: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/c0de7ff0a101bd4cb25c81707.png'
  },
  {
    name: '玫瑰图',
    spec: roseChart,
    src: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vchart/preview/rose-chart/basic-rose.png'
  },
  {
    name: '漏斗图',
    spec: baseFunnel,
    src: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vchart/preview/funnel-chart/basic-funnel.png'
  },
  {
    name: '散点图',
    spec: baseScatter,
    src: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vchart/preview/scatter-chart/basic-scatter.png'
  },
  {
    name: '雷达图',
    spec: baseRadar,
    src: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/c0de7ff0a101bd4cb25c8170c.png'
  },
  {
    name: '桑基图',
    spec: baseSankey,
    src: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/57a706137957fce7388f3ab02.png'
  },
  {
    name: '词云图',
    spec: baseWordcloud,
    src: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vchart/preview/word-cloud-chart/word-cloud-basis.png'
  }
];

const vchartSpecAtom = new VChartSpec({ originalSpec: baseGroupBar }, {});
export function QARag() {
  const vchartInstance = React.useRef<any>(null);
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [spec, setSpec] = React.useState<any>(baseGroupBar);
  const [sessionId, setSessionId] = React.useState<string>('');
  const [dialog, setDialog] = React.useState<
    {
      role: string;
      content: string;
      res?: any;
    }[]
  >([
    {
      role: 'assistant',
      content: 'Hello! How can I help you today?'
    }
  ]);
  const [specVisible, setSpecVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
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
    let res: any;
    try {
      res = await axios(`${url}vchartDsl`, {
        method: 'POST',
        headers: { 'api-key': vmindKey },
        data: {
          chartType: spec.type,
          query,
          spec,
          sessionId,
          userId: 'vmind_test'
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
    const {
      keyPathRes = [],
      qaRes = [],
      topKeys = [],
      dslRes,
      parentKeyPath,
      aliasKeyPath,
      error,
      sessionId: newSessionId
    } = res?.data;

    vchartSpecAtom.updateContext(
      {
        prevSpec: spec,
        originalSpec: spec,
        operations: dslRes.answer
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
    setSessionId(newSessionId);
  }, [dialog, query, spec, sessionId]);

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

  const handleFeedback = React.useCallback(
    (index: number) => {
      const currentDialog = dialog[index];
      Message.success('Thansk for your feedback!');
      axios(`${feedbackUrl}feedback`, {
        method: 'POST',
        headers: { 'api-key': vmindKey },
        data: {
          sessionId,
          userId: 'vmind_test',
          ...currentDialog?.res
        }
      });
    },
    [dialog, sessionId]
  );

  return (
    <div className="rag-panel">
      <div className="chart-demo-selection">
        <div></div>
        {demoData.map(chartDemo => {
          const { name, spec, src } = chartDemo;
          return (
            <div key={name} className="chart-demo" onClick={() => setSpec(spec)}>
              <img src={src.replace('https://lf9-dp-fe-cms-tos.byteorg.com', '/proxy-image')}></img>
              <div className="chart-title">{name}</div>
            </div>
          );
        })}
      </div>
      <div className="rag-container">
        <div className="vchart-container">
          <div id="chart" />
          <div className="selection">
            <Button
              size="small"
              onClick={() => {
                setSpecVisible(!specVisible);
              }}
              shape="round"
              type="primary"
            >
              {specVisible ? '智能编辑' : '人工编辑'}
            </Button>
          </div>
        </div>
        <div className="right-container">
          <div className="query-container" style={{ display: specVisible ? 'none' : 'flex' }}>
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
                    setQuery('');
                    axios(`${url}vchartDsl`, {
                      method: 'POST',
                      headers: { 'api-key': vmindKey },
                      data: {
                        sessionId,
                        userId: 'vmind_test',
                        clearHistory: true
                      }
                    });
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
                const jsonRes =
                  content.includes('"thought":') && content.includes('"spec":') ? JSON.parse(content) : {};
                const { thought, answer } = jsonRes?.spec || {};
                return (
                  <div key={index} className="assistant dialog-item">
                    <Logo style={{ width: 25, height: 25, marginRight: 4 }} />
                    <div className="assistant-content diaglog-content">
                      <div className="assistant-div">
                        {thought ? (
                          <blockquote className="thought">
                            <div className="title">思考内容:</div>
                            <div className="content">{thought}</div>
                          </blockquote>
                        ) : (
                          <span>{content}</span>
                        )}
                        {answer ? (
                          <pre className="spec-answer">
                            <code>{JSON.stringify(answer, null, 2)}</code>
                          </pre>
                        ) : null}
                      </div>
                    </div>
                    <div className="feedback">
                      {answer ? (
                        <IconThumbDownFill style={{ color: '#dc3545aa' }} onClick={() => handleFeedback(index)} />
                      ) : null}
                    </div>
                  </div>
                );
              })}
              {loading && (
                <div className="assistant dialog-item">
                  <Logo style={{ width: 25, height: 25, marginTop: 4, marginRight: 4 }} />
                  <div className="assistant-content diaglog-content">
                    <IconLoading />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="spec-editor" style={{ visibility: specVisible ? 'visible' : 'hidden' }}>
            <JSONEditor
              spec={JSON.stringify(spec, null, 2)}
              setSpec={(newSpec: string) => {
                try {
                  const a = JSON.parse(newSpec);
                  setSpec(a);
                } catch (e) {
                  console.error(e);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
