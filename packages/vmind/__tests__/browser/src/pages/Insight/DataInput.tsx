/* eslint-disable no-console */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import './index.scss';
import { Avatar, Input, Divider, Button, InputNumber, Select, Radio, Modal } from '@arco-design/web-react';
import { AtomName, LLMManage, Schedule } from '../../../../../src/index';
import { Model } from '../../../../../src/index';
import {
  ChangePointChart,
  CollegeEntranceLineChart,
  DualAxisChartData,
  GroupedBarChart,
  MultiLineChart,
  MultiLineChart2,
  SalesLineChart,
  SalesLineChart2,
  SalesLineChart3,
  SalesScatterChart,
  ScatterClusterChart,
  ScatterPlotChart
} from './data';
import JSON5 from 'json5';

const TextArea = Input.TextArea;
const Option = Select.Option;
const RadioGroup = Radio.Group;

type IPropsType = {
  onInsightGenerate: (insights: any, spec: any, costTime: number) => void;
  onSpecChange: (spec: any) => void;
};
const demoDataList: { [key: string]: any } = {
  SalesLineChart: SalesLineChart,
  DualAxisChart: DualAxisChartData,
  CollegeEntranceLineChart: CollegeEntranceLineChart,
  SalesLineChart2: SalesLineChart2,
  SalesLineChart3: SalesLineChart3,
  GroupedBarChart: GroupedBarChart,
  MultiLineChart: MultiLineChart,
  ChangePointChart: ChangePointChart,
  MultiLineChart2: MultiLineChart2,
  ScatterPlotChart: ScatterPlotChart,
  ScatterClusterChart: ScatterClusterChart,
  ScatterSalesChart: SalesScatterChart
};

const globalVariables = (import.meta as any).env;
const ModelConfigMap: any = {
  [Model.DOUBAO_PRO]: { url: globalVariables.VITE_SKYLARK_URL, key: globalVariables.VITE_SKYLARK_KEY },
  [Model.GPT3_5]: { url: globalVariables.VITE_GPT_URL, key: globalVariables.VITE_GPT_KEY },
  [Model.GPT_4o]: { url: globalVariables.VITE_GPT_URL, key: globalVariables.VITE_GPT_KEY }
};
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export function DataInput(props: IPropsType) {
  const defaultDataKey = Object.keys(demoDataList)[0];
  const [spec, setSpec] = useState<string>(JSON.stringify(demoDataList[defaultDataKey].spec));

  //const [spec, setSpec] = useState<string>('');
  //const [time, setTime] = useState<number>(1000);
  const [model, setModel] = useState<Model>(Model.GPT_4o);
  const [numLimits, setNumLimits] = useState<number>(8);
  const [visible, setVisible] = React.useState(false);
  const [url, setUrl] = React.useState(ModelConfigMap[model]?.url ?? OPENAI_API_URL);
  const [apiKey, setApiKey] = React.useState(ModelConfigMap[model]?.key);

  const [loading, setLoading] = useState<boolean>(false);

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
  const schedule = React.useRef<Schedule<[AtomName.DATA_INSIGHT]>>(
    new Schedule([AtomName.DATA_INSIGHT], {
      base: { llm: llm.current },
      dataInsight: {
        maxNum: numLimits
      }
    })
  );
  useEffect(() => {
    llm.current.updateOptions({
      url,
      headers: {
        'api-key': apiKey,
        Authorization: `Bearer ${apiKey}`
      },
      model
    });
  }, [url, model, apiKey]);

  const getInsight = useCallback(async () => {
    const startTime = new Date().getTime();
    const specJson = JSON5.parse(spec);
    schedule.current.setNewTask({
      spec: specJson
    });
    await schedule.current.run();
    const endTime = new Date().getTime();
    const costTime = endTime - startTime;
    const { insights } = schedule.current.getContext();

    props.onInsightGenerate(insights, specJson, costTime);

    console.log(costTime);
    console.log(insights);

    setLoading(false);
  }, [props, spec]);

  return (
    <div className="left-sider">
      <div
        style={{
          width: '90%'
        }}
      >
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
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
          defaultValue={defaultDataKey}
          onChange={v => {
            const dataObj = demoDataList[v];
            setSpec(JSON.stringify(dataObj.spec));
            props.onSpecChange(dataObj.spec);
          }}
        >
          {Object.keys(demoDataList).map(name => (
            <Option key={name} value={name}>
              {name}
            </Option>
          ))}
        </Select>
      </div>

      <div style={{ width: '90%', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ width: '100%' }} className="flex-text-area">
          <p>
            <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
              2
            </Avatar>
            <span style={{ marginLeft: 10 }}>Input your spec</span>
          </p>
          <TextArea
            placeholder={spec}
            value={spec}
            onChange={v => setSpec(v)}
            style={{ minHeight: 250, background: 'transparent', border: '1px solid #eee' }}
          />
        </div>
        <Divider style={{ marginTop: 12 }} />
        <div>
          <p>
            <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
              2
            </Avatar>
            <span style={{ marginLeft: 10 }}>Input Max Num Limits</span>
          </p>
          <InputNumber
            placeholder="Please enter"
            value={numLimits}
            min={0}
            max={20}
            onChange={v => {
              setNumLimits(v);
              schedule.current.updateOptions({
                dataInsight: {
                  maxNum: v
                }
              });
            }}
            style={{ width: 160, margin: '10px 24px 10px 0' }}
          />
        </div>
        <Divider style={{ marginTop: 12 }} />
      </div>

      <div style={{ width: '90%', marginBottom: 10 }}>
        <RadioGroup value={model} onChange={v => setModel(v)}>
          <Radio value={Model.GPT_4o}>GPT-4o</Radio>
          <Radio value={Model.DOUBAO_PRO}>Doubao-Pro</Radio>
        </RadioGroup>
      </div>
      <div className="generate-botton">
        <Button
          loading={loading}
          onClick={() => {
            getInsight();
          }}
          disabled={!url || !apiKey}
          shape="round"
          type="primary"
        >
          Get Insight
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
