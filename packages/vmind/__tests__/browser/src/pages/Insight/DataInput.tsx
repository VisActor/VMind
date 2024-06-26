/* eslint-disable no-console */
import React, { useState, useCallback, useMemo } from 'react';
import './index.scss';
import {
  Avatar,
  Input,
  Divider,
  Button,
  InputNumber,
  Upload,
  Message,
  Select,
  Radio,
  Checkbox,
  Modal
} from '@arco-design/web-react';
import VMind, { ArcoTheme } from '../../../../../src/index';
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
  ScatterClusterChart,
  ScatterPlotChart
} from './data';
import JSON5 from 'json5';
import { InsightLanguage } from '../../../../../src/applications/types';

const TextArea = Input.TextArea;
const Option = Select.Option;
const RadioGroup = Radio.Group;

type IPropsType = {
  onInsightGenerate: (insights: any, costTime: number) => void;
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
  ScatterClusterChart: ScatterClusterChart
};

const globalVariables = (import.meta as any).env;
const ModelConfigMap: any = {
  [Model.SKYLARK2]: { url: globalVariables.VITE_SKYLARK_URL, key: globalVariables.VITE_SKYLARK_KEY },
  [Model.SKYLARK2_v1_2]: { url: globalVariables.VITE_SKYLARK_URL, key: globalVariables.VITE_SKYLARK_KEY },
  [Model.GPT3_5]: { url: globalVariables.VITE_GPT_URL, key: globalVariables.VITE_GPT_KEY },
  [Model.GPT4]: { url: globalVariables.VITE_GPT_URL, key: globalVariables.VITE_GPT_KEY }
};
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export function DataInput(props: IPropsType) {
  const defaultDataKey = Object.keys(demoDataList)[0];
  const [spec, setSpec] = useState<string>(JSON.stringify(demoDataList[defaultDataKey].spec));
  const [fieldInfo, setFieldInfo] = useState<string>(demoDataList[defaultDataKey].fieldInfo);

  //const [spec, setSpec] = useState<string>('');
  //const [time, setTime] = useState<number>(1000);
  const [model, setModel] = useState<Model>(Model.GPT3_5);
  const [cache, setCache] = useState<boolean>(true);
  const [showThoughts, setShowThoughts] = useState<boolean>(false);
  const [visible, setVisible] = React.useState(false);
  const [url, setUrl] = React.useState(ModelConfigMap[model]?.url ?? OPENAI_API_URL);
  const [apiKey, setApiKey] = React.useState(ModelConfigMap[model]?.key);

  const [loading, setLoading] = useState<boolean>(false);

  const vmind: VMind = useMemo(() => {
    if (!url || !apiKey) {
      Message.error('Please set your LLM URL and API Key!!!');
      return null as unknown as VMind;
    }
    return new VMind({
      url,
      model,
      cache,
      showThoughts: showThoughts,
      headers: {
        'api-key': apiKey
      }
    });
  }, [apiKey, cache, model, showThoughts, url]);

  const getInsight = useCallback(async () => {
    const startTime = new Date().getTime();
    const specJson = JSON5.parse(spec);
    const insights = await vmind.intelligentInsight(specJson, {
      //insightNumberLimit: 2,
      generateText: true
      //language: InsightLanguage.EN
    });
    const endTime = new Date().getTime();
    const costTime = endTime - startTime;

    props.onInsightGenerate(insights, costTime);

    console.log(costTime);
    console.log(insights);

    setLoading(false);
  }, [props, spec, vmind]);

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
            setFieldInfo(dataObj.fieldInfo);
          }}
        >
          {Object.keys(demoDataList).map(name => (
            <Option key={name} value={name}>
              {name}
            </Option>
          ))}
        </Select>
      </div>

      <div style={{ width: '100%' }}>
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
      <div style={{ width: '100%' }}>
        <p>
          <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
            2
          </Avatar>
          <span style={{ marginLeft: 10 }}>Input your fieldInfo</span>
        </p>
        <TextArea
          placeholder={fieldInfo}
          value={fieldInfo}
          onChange={v => setSpec(v)}
          style={{ minHeight: 150, background: 'transparent', border: '1px solid #eee' }}
        />
      </div>

      <Divider style={{ marginTop: 30 }} />

      <div style={{ width: '90%', marginBottom: 10 }}>
        <RadioGroup value={model} onChange={v => setModel(v)}>
          <Radio value={Model.GPT3_5}>GPT-3.5</Radio>
          <Radio value={Model.GPT4}>GPT-4</Radio>
          <Radio value={Model.SKYLARK2}>skylark2 pro</Radio>

          <Radio value={Model.SKYLARK}>skylark pro</Radio>
          <Radio value={Model.CHART_ADVISOR}>chart-advisor</Radio>
        </RadioGroup>
      </div>
      <div style={{ width: '90%', marginBottom: 10 }}>
        <Checkbox checked={cache} onChange={v => setCache(v)}>
          Enable Cache
        </Checkbox>
      </div>
      <div style={{ width: '90%', marginBottom: 20 }}>
        <Checkbox checked={showThoughts} onChange={v => setShowThoughts(v)}>
          Show Thoughts
        </Checkbox>
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
