/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React from 'react';
import VMind, { AtomName, LLMManage, Model, Schedule } from '../../../../../src/index';
import { Button, Checkbox, Divider, Message, Select } from '@arco-design/web-react';
import {
  getCurrentFormattedTime,
  getDataExtractionCaseData,
  sleep,
  transferFieldInfoInSimpleFieldInfo
} from '../../utils';
import type { DataExtractionDataSetResult } from '../DataExtraction/type';

const globalVariables = (import.meta as any).env;
const ModelConfigMap: any = {
  [Model.GPT_4o]: { url: globalVariables.VITE_GPT_URL, key: globalVariables.VITE_GPT_KEY },
  [Model.DOUBAO_PRO]: { url: globalVariables.VITE_DOUBAO_URL, key: globalVariables.VITE_DOUBAO_KEY }
};
const datasetList = ['capcut_cn', 'capcut_en', 'common'];
const dataExtractionResult = getDataExtractionCaseData();

export function ChartGenerationTask() {
  const [selectedDataset, setSelectedDataset] = React.useState<string[]>(datasetList);
  const [selectedLLM, setSelectedLLm] = React.useState<Record<string, boolean>>(
    Object.keys(ModelConfigMap).reduce((prev, cur) => ({ ...prev, [cur]: true }), {})
  );
  const [messageApi, contextHolder] = Message.useMessage();
  const getDataSetResult = React.useCallback(
    async (
      typeResult: DataExtractionDataSetResult[],
      type: 'default' | 'fieldInfo',
      vmind: VMind,
      schedule: Schedule<[AtomName.DATA_CLEAN, AtomName.CHART_COMMAND]>,
      baseOptions: {
        dataset: string;
        model: Model;
      }
    ) => {
      const result: any[] = [];
      for (let i = 0; i < typeResult.length; i++) {
        const { dataTable, fieldInfo, text } = typeResult[i].context;
        schedule.setNewTask({
          dataTable,
          fieldInfo,
          text: text
        });
        const newCtx = await schedule.run();
        const chartGenerationResult = newCtx.command
          ? await vmind.generateChart(
              newCtx.command,
              transferFieldInfoInSimpleFieldInfo(newCtx.fieldInfo!),
              newCtx.dataTable,
              {
                theme: 'light'
              }
            )
          : {
              spec: null
            };
        result.push({
          ...baseOptions,
          type,
          context: typeResult[i].context,
          command: newCtx.command,
          spec: chartGenerationResult.spec
        });
        await sleep(baseOptions.model.includes('doubao') ? 10000 : 5000);
        console.info(`Current index:${i} Result: `, result);
      }
      return result;
    },
    []
  );
  const handleRun = React.useCallback(async () => {
    (messageApi as any).info('Run Chart Generator Task!');
    console.info('---------Run Chart Generator Task!---------');

    const result: any = [];
    const llmKeys: Model[] = Object.keys(ModelConfigMap) as any;
    for (let llmIndex = 0; llmIndex < llmKeys.length; llmIndex++) {
      const model = llmKeys[llmIndex];
      if (!selectedLLM[model]) {
        return;
      }
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
      const schedule = new Schedule([AtomName.DATA_CLEAN, AtomName.CHART_COMMAND], {
        base: { llm, showThoughts: false }
      });
      const vmind: VMind = new VMind({
        model,
        cache: false,
        url: ModelConfigMap[model]?.url,
        headers: {
          'api-key': apiKey,
          Authorization: `Bearer ${apiKey}`
        }
      });
      console.info('Begin Model: ', model);
      const currentModelDataExtractionRes = dataExtractionResult.find(v => v.llm === model)?.result || [];
      for (let i = 0; i < currentModelDataExtractionRes.length; i++) {
        const modelRes = currentModelDataExtractionRes[i];
        const { dataset, defaultResult, fieldInfoResult } = modelRes;
        if (!selectedDataset.includes(dataset)) {
          continue;
        }
        console.info('Begin Dataset: ', dataset);
        result.push(...(await getDataSetResult(defaultResult, 'default', vmind, schedule, { dataset, model })));
        // result.push(...(await getDataSetResult(fieldInfoResult, 'fieldInfo', vmind, { dataset, model })));
        console.info('Current Result: ', result);
      }
    }
    (messageApi as any).info(`Finish ALL!`);
    console.info(`---------Finish ALL---------`);
    console.info(result);
    // 将 JSON 对象转换为字符串
    const jsonString = JSON.stringify(result, null, 2);

    // 创建一个 Blob 对象
    const blob = new Blob([jsonString], { type: 'application/json' });

    // 创建一个 URL 对象
    const url = URL.createObjectURL(blob);

    // 创建一个 a 标签并设置相关属性
    const a = document.createElement('a');
    a.href = url;
    a.download = `chart_generation_${getCurrentFormattedTime()}.json`;

    // 将 a 标签添加到 DOM 并触发点击事件
    document.body.appendChild(a);
    a.click();

    // 移除 a 标签
    document.body.removeChild(a);

    // 释放 URL 对象
    URL.revokeObjectURL(url);
  }, [getDataSetResult, messageApi, selectedDataset]);

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
          {datasetList.map(v => (
            <Select.Option key={v} value={v}>
              {v}
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
      <Divider />
      <div>
        <Button onClick={handleRun} shape="round" type="primary" size="large">
          Run Test!
        </Button>
      </div>
    </div>
  );
}
