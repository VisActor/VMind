/* eslint-disable no-console */
import React, { useState, useCallback, useMemo } from 'react';
import './index.scss';
import { Avatar, Input, Divider, Button, Message, Select, Radio, Modal } from '@arco-design/web-react';
import { chartGenerationMockData } from '../../constants/chartGeneratorData';
import type { DataTable, FieldInfo } from '../../../../../src/index';
import VMind from '../../../../../src/index';
import { Model, AtomName, Schedule, LLMManage } from '../../../../../src/index';
import type { SimpleFieldInfo } from '../../../../../src/common/typings';
import { DataType } from '../../../../../src/common/typings';

const TextArea = Input.TextArea;
const Option = Select.Option;
const RadioGroup = Radio.Group;

type IPropsType = {
  onSpecGenerate: (spec: any, command: string, costTime: number) => void;
  onSpecListGenerate?: any;
};

const globalVariables = (import.meta as any).env;
const ModelConfigMap: any = {
  [Model.DOUBAO_PRO]: { url: globalVariables.VITE_DOUBAO_URL, key: globalVariables.VITE_DOUBAO_KEY },
  [Model.GPT_4o]: { url: globalVariables.VITE_GPT_URL, key: globalVariables.VITE_GPT_KEY }
};
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const specTemplateTest = false;

function dataTypeTransfer(dataType: string): DataType {
  switch (dataType) {
    case 'date':
    case 'time':
      return DataType.DATE;
    case 'count':
      return DataType.INT;
    case 'numerical':
    case 'ratio':
      return DataType.FLOAT;
    default:
      return DataType.STRING;
  }
}

function transferFieldInfoInSimpleFieldInfo(fieldInfo: FieldInfo[]): SimpleFieldInfo[] {
  return fieldInfo.map(item => ({
    fieldName: item.fieldName,
    description: item.description,
    type: dataTypeTransfer(item.fieldType),
    role: item.role
  }));
}

export function DataInput(props: IPropsType) {
  const [dataTableIndex, setdataTableIndex] = useState<number>(0);
  const [query, setQuery] = useState<string>('');
  const [model, setModel] = useState<Model>(Model.GPT_4o);
  const mockData = React.useMemo(() => {
    const llmData = chartGenerationMockData.find(item => item.llm === model) ?? chartGenerationMockData[0];
    return llmData.result;
  }, [model]);
  const [dataTable, setDataTable] = useState<DataTable>(mockData[dataTableIndex].context.dataTable as any);
  const [fieldInfo, setFieldInfo] = useState<FieldInfo[]>(mockData[dataTableIndex].context.fieldInfo as any);
  const [visible, setVisible] = React.useState(false);
  const [url, setUrl] = React.useState(ModelConfigMap[model]?.url ?? OPENAI_API_URL);
  const [apiKey, setApiKey] = React.useState(ModelConfigMap[model]?.key);

  const [loading, setLoading] = useState<boolean>(false);

  React.useEffect(() => {
    setDataTable(mockData[dataTableIndex].context.dataTable as any);
    setFieldInfo(mockData[dataTableIndex].context.fieldInfo as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  const llm = React.useRef<LLMManage>(
    new LLMManage({
      url,
      headers: {
        'api-key': apiKey,
        Authorization: `Bearer ${apiKey}`
      },
      model,
      maxTokens: 2048
    })
  );
  const schedule = React.useRef<Schedule<[AtomName.DATA_CLEAN, AtomName.CHART_COMMAND]>>(
    new Schedule([AtomName.DATA_CLEAN, AtomName.CHART_COMMAND], {
      base: { llm: llm.current },
      chartCommand: { useDataTable: true }
    })
  );

  React.useEffect(() => {
    llm.current.updateOptions({
      url,
      headers: {
        'api-key': apiKey,
        Authorization: `Bearer ${apiKey}`
      },
      model
    });
  }, [url, model, apiKey]);

  const vmind: VMind = useMemo(() => {
    if (!url || !apiKey) {
      Message.error('Please set your LLM URL and API Key!!!');
      return null as unknown as VMind;
    }
    return new VMind({
      url,
      model,
      headers: {
        //must has Authorization: `Bearer ${openAIKey}` if use openai api
        Authorization: `Bearer ${apiKey}`,
        'api-key': apiKey
      }
    });
  }, [apiKey, model, url]);

  const askGPT = useCallback(async () => {
    let finalDataTable = specTemplateTest && model !== Model.CHART_ADVISOR ? undefined : dataTable;
    let finalFieldInfo = fieldInfo;
    const startTime = new Date().getTime();

    setLoading(true);
    schedule.current.setNewTask({
      ...mockData[dataTableIndex].context
    });
    const ctx = await schedule.current.run(query);
    const finalDescribe = ctx.command;
    finalDataTable = ctx.dataTable;
    finalFieldInfo = ctx.fieldInfo || fieldInfo;
    const chartGenerationRes = finalDescribe
      ? await vmind.generateChart(finalDescribe, transferFieldInfoInSimpleFieldInfo(finalFieldInfo), finalDataTable, {
          theme: 'light'
        })
      : { spec: null };
    const endTime = new Date().getTime();
    const { spec } = chartGenerationRes;

    const finalSpec = specTemplateTest ? vmind.fillSpecWithData(spec, dataTable) : spec;

    const costTime = endTime - startTime;
    props.onSpecGenerate(finalSpec, finalDescribe, costTime);

    setLoading(false);
  }, [model, dataTable, fieldInfo, mockData, dataTableIndex, query, vmind, props]);

  return (
    <div className="left-sider">
      <div
        style={{
          width: '90%',
          marginBottom: 10
        }}
      >
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
          <Button size="small" style={{ width: 200 }} shape="round" type="primary" onClick={() => setVisible(true)}>
            Set API-Key and LLM URL
          </Button>
        </div>
      </div>
      <div style={{ width: '90%' }}>
        <p>
          <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
            0
          </Avatar>
          <span style={{ marginLeft: 10 }}>Select Demo Data (optional)</span>
        </p>
        <Select
          style={{
            width: '100%'
          }}
          defaultValue={0}
          onChange={v => {
            const ctx = mockData[v].context;
            setdataTableIndex(v);
            setFieldInfo(ctx.fieldInfo as any);
            setDataTable(ctx.dataTable as any);
          }}
        >
          {mockData.map((v, index) => (
            <Option key={`${model}-${index}`} value={index}>
              {index + 1}
            </Option>
          ))}
        </Select>
      </div>
      <div>
        <p>
          <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
            1
          </Avatar>
          <span style={{ marginLeft: 10 }}>Query to adjust result?</span>
        </p>

        <TextArea
          placeholder={query}
          value={query}
          onChange={v => setQuery(v)}
          style={{ minHeight: 60, marginTop: 12, background: 'transparent', border: '1px solid #eee' }}
        />
      </div>
      <Divider style={{ marginTop: 12 }} />
      <div>
        <p>
          <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
            2
          </Avatar>
          <span style={{ marginLeft: 10 }}>Input your fieldInfo in json format</span>
        </p>
        <TextArea
          placeholder={JSON.stringify(fieldInfo.map(info => ({ fieldName: info.fieldName })))}
          value={JSON.stringify(fieldInfo.map(info => ({ fieldName: info.fieldName })))}
          onChange={v => setFieldInfo(JSON.parse(v))}
          style={{ minHeight: 100, marginTop: 12, background: 'transparent', border: '1px solid #eee' }}
        />
      </div>

      <div>
        <p>
          <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
            3
          </Avatar>
          <span style={{ marginLeft: 10 }}>Input your data file in json format</span>
        </p>
        <TextArea
          placeholder={JSON.stringify(dataTable)}
          value={JSON.stringify(dataTable)}
          onChange={v => setDataTable(JSON.parse(v))}
          style={{ minHeight: 200, marginTop: 12, background: 'transparent', border: '1px solid #eee' }}
        />
      </div>

      <Divider style={{ marginTop: 12 }} />
      <div style={{ width: '90%', marginBottom: 10 }}>
        <RadioGroup value={model} onChange={v => setModel(v)}>
          <Radio value={Model.GPT_4o}>GPT-4o</Radio>
          <Radio value={Model.DOUBAO_PRO}>Doubao-Pro</Radio>
          <Radio value={Model.CHART_ADVISOR}>chart-advisor</Radio>
        </RadioGroup>
      </div>
      <div className="generate-botton" style={{ marginTop: 8 }}>
        <Button
          loading={loading}
          onClick={() => {
            askGPT();
          }}
          disabled={!url || !apiKey}
          shape="round"
          type="primary"
        >
          generate chart (preview)
        </Button>
      </div>
      <Modal
        title="Set API Key and URL"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        autoFocus={false}
        focusLock={true}
        okText={'OK'}
        hideCancel
      >
        <div>
          <p>LLM Service URL:</p>
          <Input value={url} onChange={v => setUrl(v)}></Input>
        </div>
        <div>
          <p>api key:</p>
          <Input value={apiKey} onChange={v => setApiKey(v)}></Input>
        </div>
      </Modal>
    </div>
  );
}
