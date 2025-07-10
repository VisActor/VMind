/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React from 'react';
import type { FieldInfo } from '../../../../../src/index';
import { capcutCnData } from '../../data/capcutDataCn';
import { capcutEnData } from '../../data/capcutDataEn';
import { capcutMockV2Data } from '../../data/capcutV2Data';
import { dataExtractionCommonDataset } from '../../data/dataExtractionData';
import type { TableColumnProps } from '@arco-design/web-react';
import { Avatar, Card, Divider, Select, Table, Tooltip } from '@arco-design/web-react';
import '../page.scss';
import { IconInfoCircle } from '@arco-design/web-react/icon';
import { getLanguageOfText } from '../../../../../src/utils/text';
import type { DataExtractionDataSetResult } from './type';
import { isArray, isObject } from '@visactor/vutils';
import { sum } from '@visactor/vchart/esm/util';
import { getDataExtractionCaseData } from '../../utils';

const datasetMap: Record<string, any> = {
  common: dataExtractionCommonDataset,
  capcut_cn: capcutCnData,
  capcut_en: capcutEnData,
  capcut_v2: capcutMockV2Data
};

interface Options {
  index: number;
  llm: string;
  resType: 'defaultResult' | 'fieldInfoResult';
}

const targetScore = 0.75;
export function DataExtractionResult() {
  const result = React.useMemo(() => getDataExtractionCaseData(), []);
  const llmList = React.useMemo(
    () =>
      result.map((v, index) => ({
        index,
        llm: v.llm
      })),
    [result]
  );
  const datasetList = React.useMemo(
    () =>
      result[0].result.map((v, index) => ({
        index,
        name: v.dataset,
        dataset: datasetMap[v.dataset]
      })),
    [result]
  );

  const [datasetIndex, setDatasetIndex] = React.useState(0);
  const currentDataset = datasetList[datasetIndex];
  const currentDatasetName = currentDataset.name;
  const [language, setLanguage] = React.useState<'all' | 'zh' | 'en'>('all');
  const [contextType, setContextType] = React.useState<'clean' | 'extraction'>('extraction');
  const [showDetail, setShowDetail] = React.useState(true);
  const [leftOptions, setLeftOptions] = React.useState<Options>({
    index: datasetIndex,
    llm: llmList[0].llm,
    resType: 'defaultResult'
  });
  const [rightOptions, setRightOptions] = React.useState<Options>({
    index: 1,
    llm: llmList?.[1]?.llm,
    resType: 'defaultResult'
  });
  const leftResult = React.useMemo(
    () => result[leftOptions.index].result.find(v => v.dataset === currentDatasetName)?.[leftOptions.resType],
    [result, leftOptions.index, leftOptions.resType, currentDatasetName]
  );
  const rightResult = React.useMemo(
    () =>
      rightOptions?.llm
        ? result[rightOptions.index].result.find(v => v.dataset === currentDatasetName)?.[rightOptions.resType]
        : null,
    [rightOptions?.llm, rightOptions.index, rightOptions.resType, result, currentDatasetName]
  );
  const renderTable = React.useCallback((context: any) => {
    const { dataTable = [], fieldInfo = [] } = context || {};
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
          if (isObject(col)) {
            return JSON.stringify(col);
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

  const renderResult = React.useCallback(
    (result: any) => {
      const context = contextType === 'clean' ? result?.dataClean ?? result?.context : result?.context;
      if (!context?.datasets?.length) {
        return renderTable(context);
      }
      return context.datasets.map((data: DataExtractionDataSetResult, index: number) => {
        return renderTable(data);
      });
    },
    [contextType, renderTable]
  );
  const changeOptions = React.useCallback(
    (v: any, type: 'llm' | 'resType' | 'language', index: number) => {
      const newOptions =
        type === 'llm'
          ? {
              index: v,
              llm: llmList?.[v]?.llm
            }
          : {
              [type]: v
            };
      if (index === 0) {
        setLeftOptions(prev => ({
          ...prev,
          ...newOptions
        }));
      } else {
        setRightOptions(prev => ({
          ...prev,
          ...newOptions
        }));
      }
    },
    [llmList]
  );

  const answerResult = React.useMemo(() => {
    const answer = result.find(v => v.llm === 'answer');
    return (answer?.result || []).find(v => v.dataset === currentDataset.name);
  }, [currentDataset.name, result]);

  const getCardDisplayStyle = React.useCallback(
    (data: DataExtractionDataSetResult) => {
      const { context } = data;
      const score = contextType === 'clean' ? data?.dataClean?.score ?? data?.score : data?.score;
      const isEn = context?.isEnglish ?? getLanguageOfText(context.text) === 'english';
      const displayStyle = language === 'all' || isEn === (language === 'en') ? {} : { display: 'none ' };
      const borderColor =
        answerResult && score !== undefined && score < targetScore
          ? {
              borderColor: 'red'
            }
          : {};
      return {
        ...displayStyle,
        ...borderColor
      };
    },
    [answerResult, contextType, language]
  );

  const renderTimeCost = React.useCallback((res: DataExtractionDataSetResult[] | undefined | null) => {
    if (res) {
      const validTimeCost = res.map(v => Number(v.timeCost)).filter(v => !isNaN(v) && v > 1 && v < 300);
      const timeCost = (sum(validTimeCost) / validTimeCost.length).toFixed(1);
      return validTimeCost.length ? <span>{`Time Cost: ${timeCost}s`}</span> : null;
    }
  }, []);

  const renderScore = React.useCallback(
    (res: DataExtractionDataSetResult[] | undefined | null) => {
      if (answerResult && res) {
        const resByType = contextType === 'clean' ? res.map(v => v.dataClean ?? v) : res;
        const validRes = resByType.filter(v => !!v.score || v.score === 0);
        const allCount = validRes.length;
        const reachedCount = validRes.filter(v => v.score! >= targetScore).length;
        let score = 0;
        let fieldScore = 0;
        let dataScore = 0;
        validRes.forEach(v => {
          score += v.score || 0;
          fieldScore += v.fieldScore || 0;
          dataScore += v.dataScore || 0;
        });
        score /= allCount;
        fieldScore /= allCount;
        dataScore /= allCount;
        const columns: TableColumnProps[] = [
          {
            title: 'All',
            dataIndex: 'allCount'
          },
          {
            title: 'Success',
            dataIndex: 'reachedCount'
          },
          {
            title: 'Rate',
            dataIndex: 'rate'
          },
          {
            title: 'Score',
            dataIndex: 'score'
          },
          {
            title: 'FieldScore',
            dataIndex: 'fieldScore'
          },
          {
            title: 'DataScore',
            dataIndex: 'dataScore'
          }
        ];
        return (
          <Table
            data={[
              {
                allCount,
                reachedCount,
                rate: (reachedCount / allCount).toFixed(2),
                score: score.toFixed(2),
                fieldScore: fieldScore.toFixed(2),
                dataScore: dataScore.toFixed(2)
              }
            ]}
            size="mini"
            columns={columns}
            pagination={{
              hideOnSinglePage: true
            }}
            scroll={{
              x: columns.length * 60
            }}
          />
        );
      }
      return <p>No answer to get score</p>;
    },
    [answerResult, contextType]
  );

  const renderCaseScore = React.useCallback(
    (data: DataExtractionDataSetResult) => {
      const resByType = contextType === 'clean' ? data?.dataClean ?? data : data;
      if (answerResult && resByType?.score !== undefined) {
        return (
          <div>
            Score: {resByType.score.toFixed(2)}
            FieldScore: {resByType.fieldScore?.toFixed(2)}
            DataScore: {resByType.dataScore?.toFixed(2)}
          </div>
        );
      }
      return null;
    },
    [answerResult, contextType]
  );
  const count = rightResult ? 2 : 1;
  const width = `${(0.8 / count) * 100}%`;
  return (
    <div className="case-container">
      <div className="dataset-selector row-flex">
        <p>Please select dataset to anlysis:</p>
        <Select defaultValue={0} onChange={v => setDatasetIndex(v)}>
          {datasetList.map(v => (
            <Select.Option key={v.index} value={v.index}>
              {v.name}
            </Select.Option>
          ))}
        </Select>
        <p>Please select result Type to show:</p>
        <Select defaultValue={contextType} onChange={v => setContextType(v)}>
          <Select.Option value="extraction">Extraction</Select.Option>
          <Select.Option value="clean">After Clean</Select.Option>
        </Select>
      </div>
      <Divider style={{ margin: '8px 0' }} />
      <div className="sub-title">Comparison Result:</div>
      <div className="compare">
        <div className="title">
          <div style={{ width: '20%' }}>
            USER INPUT
            <Select
              defaultValue={language}
              style={{ width: '15%', marginLeft: 10 }}
              size="mini"
              onChange={v => setLanguage(v)}
            >
              <Select.Option key="all" value="all">
                all
              </Select.Option>
              <Select.Option key="zh" value="zh">
                zh
              </Select.Option>
              <Select.Option key="en" value="en">
                en
              </Select.Option>
            </Select>
          </div>
          {[leftOptions, rightOptions].map((v, index) => {
            if (count === 1 && index === 1) {
              return null;
            }
            return (
              <div key={`${v.llm}-${v.index}-${index}-${v.resType}`} style={{ width }}>
                <div>
                  <Select
                    defaultValue={v.llm}
                    style={{ width: '35%', marginRight: 20 }}
                    size="mini"
                    onChange={v => changeOptions(v, 'llm', index)}
                  >
                    {llmList.map(llm => (
                      <Select.Option key={llm.llm} value={llm.index}>
                        {llm.llm}
                      </Select.Option>
                    ))}
                  </Select>
                  <Select
                    defaultValue={v.resType}
                    style={{ width: '20%', marginRight: 20 }}
                    size="mini"
                    onChange={v => changeOptions(v, 'resType', index)}
                  >
                    <Select.Option key="defaultResult" value="defaultResult">
                      defaultResult
                    </Select.Option>
                    <Select.Option key="fieldInfoResult" value="fieldInfoResult">
                      fieldInfoResult
                    </Select.Option>
                  </Select>
                </div>
                <div style={{ padding: '4px 10px' }}>{renderScore(index === 0 ? leftResult : rightResult)}</div>
                <div style={{ padding: '4px 10px' }}>{renderTimeCost(index === 0 ? leftResult : rightResult)}</div>
              </div>
            );
          })}
        </div>
        <div className="result">
          <div className="one-result" style={{ width: '20%' }}>
            <div className="result-container">
              {currentDataset.dataset.map((v: any, index: number) => (
                <Card className="one-card" key={index} style={getCardDisplayStyle({ context: v })}>
                  <Avatar size={20} style={{ backgroundColor: '#3370ff', marginRight: 4 }}>
                    {index + 1}
                  </Avatar>
                  {v.text}
                </Card>
              ))}
            </div>
          </div>
          {[leftResult, rightResult].map((llmResult, index) => {
            if (!llmResult) {
              return null;
            }
            return (
              <div className="one-result" key={index} style={{ width }}>
                <div className="result-container">
                  {llmResult.map((dataResult, index) => {
                    return (
                      <Card
                        key={index}
                        className="one-card"
                        style={getCardDisplayStyle(dataResult)}
                        onClick={() => console.log('Context is :', dataResult.context)}
                      >
                        {renderCaseScore(dataResult)}
                        {renderResult(dataResult)}
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
