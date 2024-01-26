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
import {
  mockUserInput10,
  mockUserInput2,
  mockUserInput3,
  mockUserInput3Eng,
  mockUserInput6,
  mockUserInput6Eng,
  mockUserInput8,
  carSaleMockData,
  mockUserInput15,
  acceptRatioData,
  mallSalesData,
  hotWordsData,
  mockUserInput4,
  mockUserInput5,
  mockUserInput9,
  mockUserInput11,
  mockUserInput12,
  mockUserInput13,
  mockUserInput14,
  mockUserInput16
} from '../constants/mockData';
import VMind from '../../../../src/index';
import { Model } from '../../../../src/index';
import { queryDataset } from '../../../../src/gpt/dataProcess';

const TextArea = Input.TextArea;
const Option = Select.Option;
const RadioGroup = Radio.Group;

type IPropsType = {
  onSpecGenerate: (
    spec: any,
    time: {
      totalTime: number;
      frameArr: any[];
    },
    costTime: number
  ) => void;
};
const demoDataList: { [key: string]: any } = {
  pie: mockUserInput2,
  'dynamic bar zh_cn': mockUserInput6,
  line: mockUserInput8,
  column: mockUserInput3,
  column2: mockUserInput10,
  wordcloud: hotWordsData,
  wordcloud2: mockUserInput5,
  'scatter plot': mockUserInput4,
  funnel: mockUserInput9,
  'dual-axis': mockUserInput11,
  waterfall: mockUserInput12,
  rose: mockUserInput13,
  radar: mockUserInput14,
  sankey: mockUserInput15,
  'box-plot': mockUserInput16,
  'Electric vehicle sales': carSaleMockData,
  'College entrance examination': acceptRatioData,
  'Shopping Mall Sales Performance': mallSalesData,
  'Global GDP': mockUserInput6Eng,
  'Sales of different drinkings': mockUserInput3Eng
};

const globalVariables = (import.meta as any).env;
const ModelConfigMap = {
  [Model.SKYLARK2]: { url: globalVariables.VITE_SKYLARK_URL, key: globalVariables.VITE_SKYLARK_KEY },
  [Model.SKYLARK]: { url: globalVariables.VITE_SKYLARK_URL, key: globalVariables.VITE_SKYLARK_KEY },
  [Model.GPT3_5]: { url: globalVariables.VITE_GPT_URL, key: globalVariables.VITE_GPT_KEY },
  [Model.GPT4]: { url: globalVariables.VITE_GPT_URL, key: globalVariables.VITE_GPT_KEY }
};
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export function DataInput(props: IPropsType) {
  const defaultDataKey = Object.keys(demoDataList)[3];
  const [describe, setDescribe] = useState<string>(demoDataList[defaultDataKey].input);
  const [csv, setCsv] = useState<string>(demoDataList[defaultDataKey].csv);
  const [spec, setSpec] = useState<string>('');
  const [time, setTime] = useState<number>(1000);
  const [model, setModel] = useState<Model>(Model.GPT3_5);
  const [cache, setCache] = useState<boolean>(false);
  const [showThoughts, setShowThoughts] = useState<boolean>(false);
  const [visible, setVisible] = React.useState(false);
  const [url, setUrl] = React.useState(ModelConfigMap[model].url ?? OPENAI_API_URL);
  const [apiKey, setApiKey] = React.useState(ModelConfigMap[model].key);

  const [loading, setLoading] = useState<boolean>(false);

  const vmind = useMemo(() => {
    if (!url || !apiKey) {
      Message.error('Please set your LLM URL and API Key!!!');
      return null;
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

  const askGPT = useCallback(async () => {
    //setLoading(true);
    const { fieldInfo, dataset } = vmind.parseCSVData(csv);
    //const { fieldInfo: fieldInfoQuery, dataset: datasetQuery } = await vmind?.dataQuery(describe, fieldInfo, dataset);
    //const { fieldInfo, dataset } = await vmind.parseCSVDataWithLLM(csv, describe);
    const startTime = new Date().getTime();
    const { spec, time } = await vmind.generateChart(describe, fieldInfo, dataset);
    const endTime = new Date().getTime();
    const costTime = endTime - startTime;
    props.onSpecGenerate(spec, time as any, costTime);
    setLoading(false);
  }, [vmind, csv, describe, props]);

  return (
    <div className="left-sider">
      <div
        style={{
          width: '90%',
          marginBottom: 10
        }}
      >
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
          <Button size="small" style={{ width: 200 }} shape="round" type="primary" onClick={() => setVisible(true)}>
            Set API-Key and LLM URL
          </Button>
        </div>
      </div>
      <div style={{ width: '90%', marginBottom: 20 }}>
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
            setDescribe(dataObj.input);
            setCsv(dataObj.csv);
          }}
        >
          {Object.keys(demoDataList).map(name => (
            <Option key={name} value={name}>
              {name}
            </Option>
          ))}
        </Select>
      </div>

      <div>
        <p>
          <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
            1
          </Avatar>
          <span style={{ marginLeft: 10 }}>What would you like to visualize?</span>
        </p>

        <TextArea
          placeholder={describe}
          value={describe}
          onChange={v => setDescribe(v)}
          style={{ minHeight: 80, marginTop: 20, background: 'transparent', border: '1px solid #eee' }}
        />
      </div>
      <Divider style={{ marginTop: 30 }} />
      <div>
        <p>
          <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
            2
          </Avatar>
          <span style={{ marginLeft: 10 }}>Input your data file in csv format</span>
        </p>
        {/*<Upload
          drag
          accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
          onDrop={(e) => {
            let uploadFile = e.dataTransfer.files[0]
            if (isAcceptFile(uploadFile, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel')) {
              return
            } else {
              Message.info('不接受的文件类型，请重新上传指定文件类型~');
            }
          }}
          customRequest={(option) => {
            const { file } = option;
            var reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.addEventListener('load', async (event) => {
              const result = reader.result;
              if (!result) {
                return;
              }
              const csv = await excel2csv(result);
              csv && setCsv(csv);
            });
          }}
          tip='Only pictures can be uploaded'
        />*/}
        <TextArea
          placeholder={csv}
          value={csv}
          onChange={v => setCsv(v)}
          style={{ minHeight: 160, marginTop: 20, background: 'transparent', border: '1px solid #eee' }}
        />
      </div>

      <Divider style={{ marginTop: 60 }} />
      {/*
      <div>
        <p>
          <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
            OR
          </Avatar>
          <span style={{ marginLeft: 10 }}>input spec immediately</span>
        </p>

        <TextArea
          placeholder={spec}
          defaultValue={spec}
          onChange={v => setSpec(v)}
          style={{
            marginBottom: 20,
            minHeight: 160,
            marginTop: 20,
            background: 'transparent',
            border: '1px solid #eee'
          }}
        />
        <InputNumber defaultValue={time} onChange={v => setTime(v)}></InputNumber>
      </div>*/}
      <div style={{ width: '90%', marginBottom: 10 }}>
        <RadioGroup value={model} onChange={v => setModel(v)}>
          <Radio value={Model.GPT3_5}>GPT-3.5</Radio>
          <Radio value={Model.GPT4}>GPT-4</Radio>
          <Radio value={Model.SKYLARK2}>skylark2 pro</Radio>

          <Radio value={Model.SKYLARK}>skylark pro</Radio>
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
            if (spec) {
              const jsonSpec = new Function(`return ${spec}`)();
              props.onSpecGenerate(jsonSpec, { totalTime: time } as any);
            } else {
              askGPT();
            }
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
