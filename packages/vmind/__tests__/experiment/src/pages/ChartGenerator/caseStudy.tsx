/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React from 'react';
import type { FieldInfo } from '../../../../../src/index';
import type { TableColumnProps } from '@arco-design/web-react';
import { Avatar, Card, Divider, Empty, Select, Table, Tooltip } from '@arco-design/web-react';
import { result } from '../../results/chartGeneration/result2';
import { IconInfoCircle } from '@arco-design/web-react/icon';
import { isArray } from '@visactor/vutils';
import { uniqBy } from '../../../../../src/utils/common';
import VChart from '@visactor/vchart';
import '../page.scss';

const llmList: string[] = uniqBy(result, 'model').map((v: any) => v.model);
const datasets: string[] = uniqBy(result, 'dataset').map((v: any) => v.dataset);
export function ChartGeneratorResult() {
  const [llm, setLLM] = React.useState(llmList[0]);
  const [dataset, setDataset] = React.useState(datasets[0]);
  const [type, setType] = React.useState('default');

  const filterRes = React.useMemo(
    () => result.filter(v => v.model === llm && v.dataset === dataset && v.type === type),
    [dataset, llm, type]
  );

  const idPrefix = React.useMemo(() => `${llm}-${dataset}-${type}`, [dataset, llm, type]);

  React.useEffect(() => {
    filterRes.forEach((res, index: number) => {
      if (res.spec) {
        (document.getElementById(`${idPrefix}-chart-${index}`) as any).innerHTML = '';
        const cs = new VChart(res.spec as any, {
          dom: `${idPrefix}-chart-${index}`,
          mode: 'desktop-browser',
          autoFit: true,
          disableDirtyBounds: true
        });
        cs.renderAsync();
      }
    });
  }, [idPrefix, filterRes]);

  const renderTable = React.useCallback((context: any) => {
    const { dataTable, fieldInfo } = context;
    const columns: TableColumnProps[] = fieldInfo.map((info: FieldInfo) => {
      return {
        title: (
          <div className="column-title">
            <Tooltip content={info.type}>{info.type && <div>{`${info.type[0]}__`}</div>}</Tooltip>
            <Tooltip content={info.fieldName}>{info.fieldName}</Tooltip>
            <Tooltip content={info?.description}>
              <IconInfoCircle />
            </Tooltip>
          </div>
        ),
        dataIndex: info.fieldName,
        render: (col: any) => {
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
      <div className="sub-title">Chart Generation Result:</div>
      <div className="compare">
        <div className="title">
          <div style={{ width: '20%' }}>TEXT CONTENT</div>
          <div style={{ width: '30%' }}>DATA TABLE && COMMAND</div>
          <div style={{ width: '50%' }}>CHART RESULT</div>
        </div>
        <div className="result">
          <div className="one-result" style={{ width: '20%' }}>
            <div className="result-container">
              {filterRes.map((v, index: number) => (
                <Card className="one-card" key={`${idPrefix}-${index}`}>
                  <Avatar size={20} style={{ backgroundColor: '#3370ff', marginRight: 4 }}>
                    {index + 1}
                  </Avatar>
                  {v.context.text}
                </Card>
              ))}
            </div>
          </div>
          <div className="one-result" style={{ width: '30%' }}>
            <div className="result-container">
              {filterRes.map((dataResult, index) => {
                return (
                  <Card
                    key={`${idPrefix}-${index}`}
                    className="one-card"
                    onClick={() => console.log('Context is :', dataResult)}
                  >
                    <p>Command:{`  ${dataResult.command}`}</p>
                    {renderTable(dataResult.context)}
                  </Card>
                );
              })}
            </div>
          </div>
          <div className="one-result" style={{ width: '50%' }}>
            <div className="result-container">
              {filterRes.map((dataResult, index) => {
                return (
                  <Card
                    key={`${idPrefix}-${index}`}
                    className="one-card"
                    bodyStyle={{ padding: 0 }}
                    onClick={() => console.log('Context is :', dataResult)}
                  >
                    <div id={`${idPrefix}-chart-${index}`} style={{ height: 400 }}>
                      <Empty />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
