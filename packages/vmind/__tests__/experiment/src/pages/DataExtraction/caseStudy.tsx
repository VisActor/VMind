/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React from 'react';
import type { FieldInfo } from '../../../../../src/index';
import { capcutMockData } from '../../data/capcutData';
import type { TableColumnProps } from '@arco-design/web-react';
import { Avatar, Button, Card, Checkbox, Divider, Message, Select, Table, Tooltip } from '@arco-design/web-react';
// import { result } from '../../results/dataExtraction/result';
// import { result } from '../../results/dataExtraction/result2';
import { result } from '../../results/dataExtraction/result3';
import '../page.scss';
import { IconInfoCircle } from '@arco-design/web-react/icon';

const llmList = result.map((v, index) => ({
  index,
  llm: v.llm
}));
const datasetMap: Record<string, any> = {
  capcut: capcutMockData
};
const datasetList = result[0].result.map((v, index) => ({
  index,
  name: v.dataset,
  dataset: datasetMap[v.dataset]
}));

export function DataExtractionResult() {
  const [datasetIndex, setDatasetIndex] = React.useState(0);
  const currentDataset = datasetList[datasetIndex];
  const renderTable = React.useCallback((context: any) => {
    const { dataTable, fieldInfo } = context;
    const columns: TableColumnProps[] = fieldInfo.map((info: FieldInfo) => ({
      title: (
        <div className="column-title">
          <Tooltip content={info.fieldType}>
            <div>{`${info.fieldType[0]}__`}</div>
          </Tooltip>
          <Tooltip content={info.fieldName}>{info.fieldName}</Tooltip>
          <Tooltip content={info.description}>
            <IconInfoCircle />
          </Tooltip>
        </div>
      ),
      dataIndex: info.fieldName
    }));
    return (
      <Table
        data={dataTable}
        columns={columns}
        pagination={{
          hideOnSinglePage: true
        }}
        scroll={{
          x: true
        }}
      />
    );
  }, []);

  const width = `${(0.8 / llmList.length) * 100}%`;
  return (
    <div className="case-container">
      <div className="dataset-selector">
        <p>Please select dataset to anlysis:</p>
        <Select defaultValue={0} onChange={v => setDatasetIndex(v)}>
          {datasetList.map(v => (
            <Select.Option key={v.index} value={v.index}>
              {v.name}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Divider style={{ margin: '8px 0' }} />
      <div className="sub-title">Comparision Result:</div>
      <div className="compare">
        <div className="title">
          <div style={{ width: '20%' }}>USER INPUT</div>
          {llmList.map(v => (
            <div key={v.llm} style={{ width }}>
              {v.llm}
            </div>
          ))}
        </div>
        <div className="result">
          <div className="one-result" style={{ width: '20%' }}>
            <div className="result-container">
              {currentDataset.dataset.map((v: any, index: number) => (
                <Card className="one-card" key={index}>
                  <Avatar size={20} style={{ backgroundColor: '#3370ff', marginRight: 4 }}>
                    {index + 1}
                  </Avatar>
                  {v.text}
                </Card>
              ))}
            </div>
          </div>
          {llmList.map(v => {
            const llmResult = result[v.index].result[datasetIndex].defaultResult;
            return (
              <div className="one-result" key={v.llm} style={{ width }}>
                <div className="result-container">
                  {llmResult.map((dataResult, index) => {
                    return (
                      <Card
                        key={index}
                        className="one-card"
                        onClick={() => console.log('Context is :', dataResult.context)}
                      >
                        {renderTable(dataResult.context)}
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
