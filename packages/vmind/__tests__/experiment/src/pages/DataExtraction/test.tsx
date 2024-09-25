/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React from 'react';
import { AtomName, LLMManage, Model, Schedule } from '../../../../../src/index';
import { capcutCnData } from '../../data/capcutDataCn';
import { capcutEnData } from '../../data/capcutDataEn';
import { Button, Checkbox, Divider, Message, Select } from '@arco-design/web-react';
import { dataExtractionCommonDataset } from '../../data/dataExtractionData';
import { pick } from '@visactor/vutils';
import { getCurrentFormattedTime, sleep } from '../../utils';

const globalVariables = (import.meta as any).env;
const ModelConfigMap: any = {
  [Model.DOUBAO_PRO]: { url: globalVariables.VITE_DOUBAO_URL, key: globalVariables.VITE_DOUBAO_KEY },
  [Model.DOUBAO_PRO_32K]: { url: globalVariables.VITE_DOUBAO_URL, key: globalVariables.VITE_DOUBAO_KEY },
  [Model.GPT_4o]: { url: globalVariables.VITE_GPT_URL, key: globalVariables.VITE_GPT_KEY }
};
const datasets = [
  {
    name: 'capcut_cn',
    data: capcutCnData
  },
  {
    name: 'capcut_en',
    data: capcutEnData
  },
  {
    name: 'common',
    data: dataExtractionCommonDataset
  }
];

export function DataExtractionTask() {
  const [selectedDataset, setSelectedDataset] = React.useState<string[]>(['common']);
  const [selectedLLM, setSelectedLLm] = React.useState<Record<string, boolean>>(
    Object.keys(ModelConfigMap).reduce((prev, cur) => ({ ...prev, [cur]: true }), {})
  );
  const [useDefault, setUseDefault] = React.useState<boolean>(true);
  const [useFieldInfo, setUseFieldInfo] = React.useState<boolean>(false);
  const [messageApi, contextHolder] = Message.useMessage();
  const handleRun = React.useCallback(async () => {
    (messageApi as any).info('Run Data Extraction Task!');
    console.info('---------Run Data Extraction Task!---------');

    const llmResult: any = [];
    const llmKeys = Object.keys(ModelConfigMap);
    for (let index = 0; index < llmKeys.length; index++) {
      const model = llmKeys[index];
      if (!selectedLLM[model]) {
        continue;
      }
      const sleepTime = model === Model.DOUBAO_PRO ? 8000 : 5000;
      const apiKey = ModelConfigMap[model]?.key;
      const llm = new LLMManage({
        url: ModelConfigMap[model]?.url,
        headers: {
          'api-key': apiKey,
          Authorization: `Bearer ${apiKey}`
        },
        maxTokens: 2048,
        model
      });
      const schedule = new Schedule([AtomName.DATA_EXTRACT], {
        base: { llm, showThoughts: false },
        dataExtract: {
          reGenerateFieldInfo: true
        }
      });
      (messageApi as any).info(`Begin ${model}!`);
      console.info(`---------Begin ${model}---------`);

      const datasetResult: any[] = [];
      for (let datasetIndex = 0; datasetIndex < datasets.length; datasetIndex++) {
        const dataset = datasets[datasetIndex];
        if (!selectedDataset.includes(dataset.name)) {
          continue;
        }
        (messageApi as any).info(`Begin ${dataset.name} dataset!`);
        console.info(`---------Begin ${dataset.name} dataset---------`);

        const defaultResult: any[] = [];
        const fieldInfoResult: any[] = [];
        for (let dataIndex = 0; dataIndex < dataset.data.length; dataIndex++) {
          const data = dataset.data[dataIndex];
          if (useDefault) {
            schedule.setNewTask({
              text: data.text
            });
            const time1: any = new Date();
            const result = await schedule.run();
            const time2: any = new Date();
            defaultResult.push({
              context: result,
              timeCost: ((time2 - time1) / 1000).toFixed(1)
            });
            await sleep(sleepTime);
          }
          if (useFieldInfo) {
            schedule.setNewTask({
              text: data.text,
              fieldInfo: data.fieldInfo.map((v: any) => pick(v, ['fieldName']))
            });
            const time1: any = new Date();
            const result = await schedule.run();
            const time2: any = new Date();
            fieldInfoResult.push({
              context: result,
              timeCost: ((time2 - time1) / 1000).toFixed(1)
            });
            await sleep(sleepTime);
          }
          console.info(`---------Finish dataset_${dataIndex}---------`);
        }
        datasetResult.push({
          dataset: dataset.name,
          defaultResult,
          fieldInfoResult
        });
      }

      llmResult.push({
        llm: model,
        result: datasetResult
      });
    }
    (messageApi as any).info(`Finish ALL!`);
    console.info(`---------Finish ALL---------`);
    console.info(llmResult);
    // 将 JSON 对象转换为字符串
    const jsonString = JSON.stringify(llmResult, null, 2);

    // 创建一个 Blob 对象
    const blob = new Blob([jsonString], { type: 'application/json' });

    // 创建一个 URL 对象
    const url = URL.createObjectURL(blob);

    // 创建一个 a 标签并设置相关属性
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_${getCurrentFormattedTime()}.json`;

    // 将 a 标签添加到 DOM 并触发点击事件
    document.body.appendChild(a);
    a.click();

    // 移除 a 标签
    document.body.removeChild(a);

    // 释放 URL 对象
    URL.revokeObjectURL(url);
  }, [messageApi, selectedDataset, selectedLLM, useDefault, useFieldInfo]);

  return (
    <div style={{ padding: 20 }}>
      {contextHolder}
      <div className="dataset-selector">
        <p>Please select dataset to run:</p>
        <Select
          defaultValue={selectedDataset}
          mode="multiple"
          onChange={v => {
            setSelectedDataset(v);
          }}
        >
          {datasets.map((v, index) => (
            <Select.Option key={v.name} value={v.name}>
              {v.name}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div>
        <p>LLM Model To Select</p>
        {Object.keys(ModelConfigMap).map(modelName => {
          return (
            <Checkbox
              checked={selectedLLM[modelName]}
              key={modelName}
              onChange={v => setSelectedLLm(prev => ({ ...prev, [modelName]: v }))}
            >
              {modelName}
            </Checkbox>
          );
        })}
      </div>
      <div>
        <p>Config of Data Extraction</p>
        <Checkbox checked={useFieldInfo} onChange={v => setUseFieldInfo(v)}>
          With FieldName Only
        </Checkbox>
        <Checkbox checked={useDefault} onChange={v => setUseDefault(v)}>
          Without FieldInfo
        </Checkbox>
      </div>
      <Divider />
      <div>
        <Button onClick={handleRun} shape="round" type="primary" size="large">
          Run Test!
        </Button>
      </div>
    </div>
  );
}
