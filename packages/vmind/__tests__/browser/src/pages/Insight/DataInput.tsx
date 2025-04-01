/* eslint-disable no-console */
import React, { useState, useCallback, useEffect } from 'react';
import '../index.scss';
import { Avatar, Input, Divider, Button, InputNumber, Select, Radio, Modal, Checkbox } from '@arco-design/web-react';
import VMind from '../../../../../src/index';
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
  ScatterPlotChart,
  ScatterIrisData
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
  ScatterSalesChart: SalesScatterChart,
  ScatterIrisData: ScatterIrisData
};

const globalVariables = (import.meta as any).env;
const ModelConfigMap: Record<string, { url: string; key: string }> = {
  [Model.DOUBAO_PRO]: { url: globalVariables.VITE_DOUBAO_URL, key: globalVariables.VITE_DOUBAO_KEY },
  [Model.GPT4]: { url: globalVariables.VITE_GPT_URL, key: globalVariables.VITE_GPT_KEY },
  [Model.GPT_4o]: { url: globalVariables.VITE_GPT_URL, key: globalVariables.VITE_GPT_KEY },
  [Model.DEEPSEEK_R1]: { url: globalVariables.VITE_DEEPSEEK_URL, key: globalVariables.VITE_DEEPSEEK_KEY },
  [Model.DEEPSEEK_V3]: { url: globalVariables.VITE_DEEPSEEK_URL, key: globalVariables.VITE_DEEPSEEK_KEY },
  Custom: { url: globalVariables.VITE_CUSTOM_URL, key: globalVariables.VITE_CUSTOM_KEY }
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
  const [enableAnnotation, setEnableAnnotation] = React.useState(false);

  const [loading, setLoading] = useState<boolean>(false);

  const vmind = React.useRef<VMind>(
    new VMind({
      url,
      headers: {
        'api-key': apiKey,
        Authorization: `Bearer ${apiKey}`
      },
      model,
      maxTokens: 2048
    })
  );
  useEffect(() => {
    vmind.current.updateOptions({
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
    const { insights } = await vmind.current.getInsights(specJson, {
      maxNum: numLimits,
      algorithmOptions: {
        pearsonCorrelation: { withoutSeries: true, threshold: 0.75 },
        lofOutlier: { threshold: 2 },
        statisticsBase: { defaultLeftAxisName: '左轴', defaultRightAxisName: '右轴' }
      },
      // usePolish: false,
      detailMaxNum: [
        { types: ['outlier', 'pair_outlier', 'extreme_value', 'turning_point', 'majority_value'], maxNum: 3 },
        { types: ['abnormal_band'], maxNum: 3 },
        { types: ['correlation'], maxNum: 2 },
        { types: ['overall_trend'], maxNum: 2 },
        { types: ['abnormal_trend'], maxNum: 3 }
      ]
    } as any);
    const endTime = new Date().getTime();
    const costTime = endTime - startTime;
    let newSpec = null;
    if (enableAnnotation) {
      newSpec = (await vmind.current.updateSpecByInsights(specJson, insights)).newSpec;
      console.log(newSpec);
    }
    props.onInsightGenerate(insights, enableAnnotation ? newSpec : specJson, costTime);

    console.log(costTime);
    console.log(insights);

    setLoading(false);
  }, [numLimits, props, spec, enableAnnotation]);

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
            }}
            style={{ width: 160, margin: '10px 24px 10px 0' }}
          />
        </div>
        <Divider style={{ marginTop: 12 }} />
      </div>

      <div style={{ width: '90%', marginBottom: 10 }}>
        <RadioGroup
          value={model}
          onChange={v => {
            setModel(v);
            if (ModelConfigMap[v]?.url && !ModelConfigMap[v].url.startsWith('Your')) {
              setUrl(ModelConfigMap[v]?.url);
            }
            if (ModelConfigMap[v]?.key && !ModelConfigMap[v].key.startsWith('Your')) {
              setApiKey(ModelConfigMap[v]?.key);
            }
          }}
        >
          <Radio value={Model.DEEPSEEK_V3}>DeepSeek-V3</Radio>
          <Radio value={Model.DEEPSEEK_R1}>DeepSeek-R1</Radio>
          <Radio value={Model.GPT_4o}>GPT-4o</Radio>
          <Radio value={globalVariables.VITE_CUSTOM_MODEL}>Your Custom Model</Radio>
        </RadioGroup>
      </div>
      <div style={{ width: '90%', marginBottom: 10 }}>
        <Checkbox checked={enableAnnotation} onChange={v => setEnableAnnotation(v)}>
          Enable Insights Annotation
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
