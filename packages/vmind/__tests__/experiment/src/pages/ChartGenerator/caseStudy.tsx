/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React from 'react';
import { DataType, type FieldInfo } from '../../../../../src/index';
import type { TableColumnProps } from '@arco-design/web-react';
import { Avatar, Card, Divider, Empty, Select, Table, Tooltip, Tabs, Typography } from '@arco-design/web-react';
import { result } from '../../results/chartGeneration/capcutPromptResult2';
import { IconInfoCircle } from '@arco-design/web-react/icon';
import { isArray } from '@visactor/vutils';
import { uniqBy } from '../../../../../src/utils/common';
import VChart, { registerLiquidChart } from '@visactor/vchart';
import type { ChartGeneratorCase } from './type';
import '../page.scss';
import { average } from '@visactor/vchart/esm/util';

const TabPane = Tabs.TabPane;

registerLiquidChart();
const llmList: string[] = uniqBy(result, 'model').map((v: any) => v.model);
const datasets: string[] = uniqBy(result, 'dataset').map((v: any) => v.dataset);
export function ChartGeneratorResult() {
  const [llm, setLLM] = React.useState(llmList[0]);
  const [dataset, setDataset] = React.useState(datasets[0]);
  const [type, setType] = React.useState('default');
  const [resultType, setResultType] = React.useState<'all' | 'chart'>('chart');
  const [highlightInfo, setHighlightInfo] = React.useState({
    index: -1,
    textRange: [0, 0]
  });
  const [activeTab, setActiveTab] = React.useState('1');

  const filterRes = React.useMemo(
    () => result.filter(v => v.model === llm && v.dataset === dataset && v.type === type),
    [dataset, llm, type]
  );

  const idPrefix = React.useMemo(() => `${llm}-${dataset}-${type}`, [dataset, llm, type]);

  const renderTimeCost = React.useCallback(() => {
    llmList.forEach(model => {
      const divId = `${model}-${dataset}-${type}`;
      const timeCostDiv = document.getElementById(divId);
      if (timeCostDiv) {
        timeCostDiv.innerHTML = '';
        const timeCostList: any = [];
        const textLengthList: any = [];
        result
          .filter(v => v.model === model && v.dataset === dataset && v.type === type)
          .forEach((v, index) => {
            timeCostList.push(
              {
                index: index + 1,
                type: 'all',
                y: v.timeCost
              },
              {
                index: index + 1,
                type: 'extraction',
                y: v.extractionCost
              },
              {
                index: index + 1,
                type: 'chart',
                y: v.generationCost
              }
            );
            textLengthList.push({
              index: index + 1,
              type: 'textLength',
              y: v.context.text.length
            });
          });
        const cs = new VChart(
          {
            type: 'common',
            seriesField: 'color',
            data: [
              {
                id: 'timeCost',
                values: timeCostList
              },
              {
                id: 'textLength',
                values: textLengthList
              }
            ],
            series: [
              {
                type: 'bar',
                id: 'bar',
                dataIndex: 1,
                label: { visible: true },
                seriesField: 'type',
                xField: ['index', 'type'],
                yField: 'y'
              },
              {
                type: 'line',
                id: 'line',
                dataIndex: 0,
                label: { visible: true },
                seriesField: 'type',
                xField: 'index',
                yField: 'y',
                stack: false
              }
            ],
            axes: [
              { orient: 'left', seriesIndex: [0] },
              { orient: 'right', seriesId: ['line'], grid: { visible: false } },
              { orient: 'bottom', label: { visible: true }, type: 'band' }
            ],
            legends: {
              visible: true,
              orient: 'bottom'
            }
          },
          {
            dom: divId,
            mode: 'desktop-browser',
            autoFit: true,
            disableDirtyBounds: true
          }
        );
        cs.renderAsync();
      }
    });
  }, [dataset, type]);

  React.useEffect(() => {
    renderTimeCost();
  }, [activeTab]);

  React.useEffect(() => {
    filterRes.forEach((res, index: number) => {
      const { chartRes: caseChartRes } = res;
      const chartData = caseChartRes?.length ? caseChartRes.map(v => v.context.spec) : [res.spec];
      chartData.forEach((spec, subIndex) => {
        if (spec) {
          (document.getElementById(`${idPrefix}-chart-${index}-${subIndex}`) as any).innerHTML = '';
          const cs = new VChart(spec as any, {
            dom: `${idPrefix}-chart-${index}-${subIndex}`,
            mode: 'desktop-browser',
            autoFit: true,
            disableDirtyBounds: true
          });
          cs.renderAsync();
        }
      });
    });
    renderTimeCost();
  }, [idPrefix, filterRes, renderTimeCost]);

  const renderTable = React.useCallback((context: any) => {
    const { dataTable, fieldInfo } = context;
    const columns: TableColumnProps[] = fieldInfo.map((info: FieldInfo) => {
      return {
        title: (
          <div className="column-title">
            <Tooltip content={info.fieldName}>{info.fieldName}</Tooltip>
            {info.role === 'measure' && info.unit && <span>{`(${info.unit})`}</span>}
          </div>
        ),
        dataIndex: info.fieldName,
        render: (col: any) => {
          if (info.type === DataType.RATIO && info.ratioGranularity === '%') {
            return isArray(col) ? col.map(v => v * 100).join('-') : `${Number(col) * 100}%`;
          }
          return isArray(col) ? col.join('-') : col;
        }
      };
    });
    return (
      <Table
        data={dataTable}
        columns={columns}
        pagination={{
          hideOnSinglePage: true
        }}
        scroll={{
          x: columns.length * 120
        }}
      />
    );
  }, []);

  const renderOneCard = React.useCallback(
    (caseData: ChartGeneratorCase, id: string, caseIndex: number) => {
      const { context: caseCtx, command, chartRes: caseChartRes } = caseData;
      const chartData = caseChartRes?.length
        ? caseChartRes
        : [
            {
              context: {
                ...caseCtx,
                spec: caseData?.spec,
                command: caseData?.command
              },
              textRange: null
            }
          ];
      const datasets = caseCtx?.datasets?.length
        ? caseCtx.datasets
        : [
            {
              dataTable: caseCtx.dataTable,
              fieldInfo: caseCtx.fieldInfo
            }
          ];
      const text = caseCtx.text;
      return (
        <Card className="one-card" style={{ height: 700 }} onClick={() => console.log('Context is :', caseData)}>
          {chartData.map((chart, index: number) => {
            const { context } = chart;
            const { command, spec } = context;
            const { textRange } = datasets[index];
            return (
              <div
                className="result-container"
                key={index}
                onMouseEnter={() => {
                  if (textRange) {
                    setHighlightInfo({
                      index: caseIndex,
                      textRange: [text.indexOf(textRange[0]), text.indexOf(textRange[1]) + textRange[1].length - 1]
                    });
                  }
                }}
                onMouseLeave={() => {
                  setHighlightInfo({
                    index: -1,
                    textRange: [0, 0]
                  });
                }}
              >
                <p>Command: {command}</p>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {spec && (
                    <div id={`${id}-${index}`} style={{ height: 250, flexShrink: 0 }}>
                      <Empty />
                    </div>
                  )}
                  {!spec || resultType === 'all' ? renderTable(datasets[index]) : null}
                </div>
              </div>
            );
          })}
        </Card>
      );
    },
    [renderTable, resultType]
  );

  const renderTextByIndex = React.useCallback(
    (text: string, index: number) => {
      const { index: hIndex, textRange } = highlightInfo;
      return text.split('').map((v, textIndex) => {
        return (
          <span
            key={`${index}-${textIndex}-${v}`}
            style={{
              color:
                index === hIndex && textIndex >= textRange[0] && textIndex <= textRange[1]
                  ? '#ffa500'
                  : 'rgba(0,0,0,0.7)'
            }}
          >
            {v}
          </span>
        );
      });
    },
    [highlightInfo]
  );

  const renderCompareResult = React.useMemo(() => {
    return (
      <div className="compare">
        <div className="title">
          <div style={{ width: '35%' }}>TEXT CONTENT</div>
          <div style={{ width: '65%' }}>
            CHART RESULT
            <Select
              defaultValue={resultType}
              style={{ width: '15%', marginLeft: 10 }}
              size="mini"
              onChange={v => setResultType(v)}
            >
              <Select.Option key="all" value="all">
                all
              </Select.Option>
              <Select.Option key="chart" value="chart">
                chart
              </Select.Option>
            </Select>
          </div>
        </div>
        <div className="result">
          <div className="one-result" style={{ width: '35%' }}>
            <div className="result-container">
              {filterRes.map((v, index: number) => (
                <Card className="one-card" key={`${idPrefix}-${index}`} style={{ height: 700 }}>
                  <Avatar size={20} style={{ backgroundColor: '#3370ff', marginRight: 4 }}>
                    {index + 1}
                  </Avatar>
                  {renderTextByIndex(v.context.text, index)}
                </Card>
              ))}
            </div>
          </div>
          <div className="one-result" style={{ width: '65%' }}>
            <div className="result-container">
              {filterRes.map((dataResult, index) => {
                return renderOneCard(dataResult, `${idPrefix}-chart-${index}`, index);
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }, [filterRes, idPrefix, renderOneCard, renderTextByIndex, resultType]);

  const renderSummaryResult = React.useMemo(() => {
    return (
      <div className="summary">
        {llmList.map(model => {
          const modeLData = result.filter(
            v => v.model === model && v.dataset === dataset && v.type === type && v.timeCost >= 1
          );
          return (
            <>
              <div>{`${model}`}</div>
              <div>{`Avg Time Cost: ${average(modeLData.map(v => v.timeCost)).toFixed(1)}s`}</div>
              <div>{`Avg Data Extraction Cost: ${average(
                modeLData.map(v => v.extractionCost).filter(v => v >= 1)
              ).toFixed(1)}s`}</div>
              <div>{`Avg Chart Generation Time Cost: ${average(modeLData.map(v => v.generationCost)).toFixed(
                1
              )}s`}</div>
              <div id={`${model}-${dataset}-${type}`} key={`${model}-${dataset}-${type}`} />
            </>
          );
        })}
      </div>
    );
  }, [dataset, type]);
  return (
    <div className="case-container">
      <div className="header row-flex">
        <div className="llm-selector row-flex">
          <p>Please select LLM to show result:</p>
          <Select value={llm} onChange={v => setLLM(v)}>
            {llmList.map(v => (
              <Select.Option key={v} value={v}>
                {v}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="dataset-selector row-flex">
          <p>Please select dataset to anlysis:</p>
          <Select value={dataset} onChange={v => setDataset(v)}>
            {datasets.map(v => (
              <Select.Option key={v} value={v}>
                {v}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="type-selector row-flex">
          <p>Please select type</p>
          <Select value={type} onChange={v => setType(v)}>
            <Select.Option value={'default'}>default</Select.Option>
            <Select.Option value={'fieldInfo'}>fieldName</Select.Option>
          </Select>
        </div>
      </div>
      <Divider style={{ margin: '8px 0' }} />
      <Tabs activeTab={activeTab} onChange={setActiveTab}>
        <TabPane key="1" title="Chart Generation Detail" className="chart-generation-tab-panel">
          <Typography.Paragraph>{renderCompareResult}</Typography.Paragraph>
        </TabPane>
        <TabPane key="2" title="Indicator Summary">
          <Typography.Paragraph>{renderSummaryResult}</Typography.Paragraph>
        </TabPane>
      </Tabs>
    </div>
  );
}
