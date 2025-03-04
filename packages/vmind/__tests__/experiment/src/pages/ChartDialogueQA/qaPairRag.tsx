/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React from 'react';
import axios from 'axios';
import { Input, Card, Message, Checkbox, Select, Tooltip, Modal, Form, Button } from '@arco-design/web-react';
import './rag.scss';
import { IconDelete, IconLoading, IconRobot, IconSend, IconUser } from '@arco-design/web-react/icon';
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
  multipleLine,
  pieChart,
  roseChart,
  stackBar
} from '../../data/editorData';
import { JSONEditor } from './specEditor';

const { Option } = Select;
const TextArea = Input.TextArea;
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
const topKeys = [
  'NotSure',
  'type',
  'series',
  'axes',
  'crosshair',
  'data',
  'width',
  'height',
  'autoFit',
  'color',
  'seriesStyle',
  'animationThreshold',
  'hover',
  'select',
  'region',
  'title',
  'layout',
  'legends',
  'tooltip',
  'player',
  'dataZoom',
  'scrollBar',
  'brush',
  'scales',
  'customMark',
  'theme',
  'background',
  'stackInverse',
  'stackSort',
  'media',
  'autoBandSize',
  'direction',
  'markLine',
  'markArea',
  'markPoint',
  'padding',
  'percent',
  'name',
  'id',
  'animation',
  'stack',
  'animationEnter',
  'animationUpdate',
  'animationExit',
  'dataIndex',
  'sampling',
  'animationState',
  'large',
  'largeThreshold',
  'progressiveStep',
  'progressiveThreshold',
  'support3d',
  'regionIndex',
  'regionId',
  'totalLabel',
  'animationAppear',
  'animationDisappear',
  'animationNormal',
  'xField',
  'yField',
  'label',
  'bar',
  'barBackground',
  'barWidth',
  'barMinWidth',
  'barMaxWidth',
  'barGapInGroup',
  'barMinHeight',
  'stackCornerRadius',
  'x2Field',
  'y2Field',
  'zField',
  'sortDataByAxis',
  'dataId',
  'dataKey',
  'seriesField',
  'stackOffsetSilhouette',
  'invalidType',
  'extensionMark',
  'interactions',
  'activePoint',
  'samplingFactor'
];
const vchartSpecAtom = new VChartSpec({ spec: baseSpec }, {});

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

export function QARag() {
  const vchartInstance = React.useRef<any>(null);
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [spec, setSpec] = React.useState<any>(baseSpec);
  const [sessionId, setSessionId] = React.useState<string>('');
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
      res = await axios(`${url}queryKeyPath`, {
        method: 'POST',
        data: {
          chartType: 'bar',
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
                    setSpec(baseSpec);
                    setQuery('');
                    axios(`${url}closeSession`, {
                      method: 'POST',
                      data: {
                        sessionId,
                        userId: 'vmind_test'
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
