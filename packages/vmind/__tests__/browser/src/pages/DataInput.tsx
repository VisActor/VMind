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
  mockUserInput16,
  mockUserInput17,
  mockUserInput18,
  mockUserTextInput1,
  mockUserTextInput2
} from '../constants/mockData';
import VMind, { ArcoTheme, InputType, Model } from '../../../../src/index';
import { isArray } from 'lodash';
import { VMindDataset } from "../../../../src/common/typings";

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
  onSpecListGenerate: any;
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
  'Sales of different drinkings': mockUserInput3Eng,
  'Multi measure': mockUserInput17,
  DataQuery: mockUserInput18
};
const demoTextList: { [key: string]: any } = {
  demo: mockUserTextInput1,
  demo2: mockUserTextInput2
};

const globalVariables = (import.meta as any).env;
const ModelConfigMap: any = {
  [Model.SKYLARK2]: { url: globalVariables.VITE_SKYLARK_URL, key: globalVariables.VITE_SKYLARK_KEY },
  [Model.SKYLARK]: { url: globalVariables.VITE_SKYLARK_URL, key: globalVariables.VITE_SKYLARK_KEY },
  [Model.GPT3_5]: { url: globalVariables.VITE_GPT_URL, key: globalVariables.VITE_SKYLARK_KEY },
  [Model.GPT3_5_1106]: { url: globalVariables.VITE_GPT_URL, key: globalVariables.VITE_SKYLARK_KEY },
  [Model.GPT4]: { url: globalVariables.VITE_GPT_URL, key: globalVariables.VITE_GPT_KEY }
};
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
// const OPENAI_API_URL = 'https://api.gptapi.us/v1/chat/completions';

const specTemplateTest = false;
export function DataInput(props: IPropsType) {
  const defaultDataKey = Object.keys(demoDataList)[3];
  const [describe, setDescribe] = useState<string>(demoDataList[defaultDataKey].input);
  const [csv, setCsv] = useState<string>(demoDataList[defaultDataKey].csv);
  const defaultDataKeyForTextInput = Object.keys(demoTextList)[0];
  const [text, setText] = useState<string>(demoTextList[defaultDataKeyForTextInput].text);
  const [userInput, setUserInput] = useState<string>(demoTextList[defaultDataKeyForTextInput].input);
  const [dataset, setDataset] = useState<string>('');
  const [instructionByLLM, setInstructionByLLM] = useState<string>('');
  //const [spec, setSpec] = useState<string>('');
  //const [time, setTime] = useState<number>(1000);
  const [model, setModel] = useState<Model>(Model.GPT3_5);
  const [cache, setCache] = useState<boolean>(true);
  const [showThoughts, setShowThoughts] = useState<boolean>(false);
  const [visible, setVisible] = React.useState(false);
  const [url, setUrl] = React.useState(ModelConfigMap[model]?.url ?? OPENAI_API_URL);
  const [apiKey, setApiKey] = React.useState(ModelConfigMap[model]?.key);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingGenerateData, setLoadingGenerateData] = useState<boolean>(false);
  const [inputType, setInputType] = React.useState(InputType.CSV_INPUT);

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
        'api-key': apiKey,
        // 'Authorization': `Bearer ${apiKey}`
      }
    });
  }, [apiKey, cache, model, showThoughts, url]);

  const dataset2Csv = (dataset: VMindDataset) => {
    const header = Object.keys(dataset[0]).join(',');
    const rows = dataset.map(obj => Object.values(obj).join(','));
    return `${header}\n${rows.join('\n')}`;
  }

  const askGPT = useCallback(async (csv: string, describe: string) => {
    //setLoading(true);
    //const { fieldInfo: fieldInfoQuery, dataset: datasetQuery } = await vmind?.dataQuery(describe, fieldInfo, dataset);
    //const dataset = mockData4;
    //const fieldInfo = vmind?.getFieldInfo(dataset);
    const { fieldInfo, dataset } = vmind.parseCSVData(csv);

    console.log(fieldInfo);
    const finalFieldInfo = specTemplateTest
      ? fieldInfo.map(info => ({ fieldName: info.fieldName, role: info.role, type: info.type }))
      : fieldInfo;

    const finalDataset = specTemplateTest ? undefined : dataset;

    const startTime = new Date().getTime();
    const chartGenerationRes = await vmind.generateChart(describe, finalFieldInfo, finalDataset, {
      //enableDataQuery: false,
      //chartTypeList: [ChartType.BarChart, ChartType.LineChart],
      colorPalette: ArcoTheme.colorScheme
    });
    const endTime = new Date().getTime();
    console.log(chartGenerationRes);
    if (isArray(chartGenerationRes)) {
      props.onSpecListGenerate(chartGenerationRes.map(res => res.spec));
    } else {
      const { spec, time, cell } = chartGenerationRes;

      const finalSpec = specTemplateTest
        ? vmind.fillSpecWithData(spec, dataset, cell, finalFieldInfo, time.totalTime)
        : spec;

      const costTime = endTime - startTime;
      props.onSpecGenerate(finalSpec, time as any, costTime);
    }

    setLoading(false);
  }, [vmind, csv, describe, props]);
  const askGPTForGenerateData = useCallback(async () => {
    const { instruction, dataset, fieldInfo } = await vmind.extractDataFromText(text, userInput);

    console.log(instruction, dataset, fieldInfo);
    setDataset(dataset2Csv(dataset));
    setInstructionByLLM(instruction);

    setLoadingGenerateData(false);
  }, [vmind, text, userInput, props]);

  return (
    <div className="left-sider">
      <div style={{ width: '90%', marginTop:20, marginBottom: 10 }}>
        <RadioGroup value={model} onChange={v => setModel(v)}>
          <Radio value={Model.GPT3_5_1106}>GPT-3.5-1106</Radio>
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
      <div style={{ width: '90%', marginBottom: 10 }}>
        <Checkbox checked={showThoughts} onChange={v => setShowThoughts(v)}>
          Show Thoughts
        </Checkbox>
      </div>
      <div
        style={{
          width: '90%',
          marginBottom: 10
        }}
      >
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
          <Button size="small" style={{ width: 200 }} shape="round" type="primary" onClick={() => setVisible(true)}>
            Set API-Key and LLM URL
          </Button>
        </div>
      </div>
      <Divider/>
      <div style={{ width: '90%', marginBottom: 20 }}>
        <div style={{ marginTop: 20 }}>
          <RadioGroup value={inputType} onChange={type => setInputType(type)}>
            <Radio value={InputType.CSV_INPUT}>csv format input</Radio>
            <Radio value={InputType.TEXT_INPUT}>text format input</Radio>
          </RadioGroup>
        </div>
      </div>
      {
        inputType === InputType.CSV_INPUT ? (
          <div>
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
          </div>
        ) : (
          <div style={{ width: '90%', display: "flex", flexDirection: 'column' }}>
            <div>
              <p>
                <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
                  0
                </Avatar>
                <span style={{ marginLeft: 10 }}>Select Demo Data (optional)</span>
              </p>
              <Select
                style={{width: '100%'}}
                // defaultValue={defaultDataKeyForTextInput}
                onChange={v => {
                  const dataObj = demoTextList[v];
                  setText(dataObj.text)
                  setUserInput(dataObj.input)
                }}
              >
                {Object.keys(demoTextList).map(name => (
                  <Option key={name} value={name}>
                    {name}
                  </Option>
                ))}
              </Select>
            </div>

            <div style={{marginTop: 20}}>
              <p>
                <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
                  1
                </Avatar>
                <span style={{ marginLeft: 10 }}>Input your data in text format</span>
              </p>
              <TextArea
                placeholder={text}
                value={text}
                onChange={v => setText(v)}
                style={{ minHeight: 200, background: 'transparent', border: '1px solid #eee' }}
              />
            </div>

            <div style={{marginTop: 20}}>
              <p>
                <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
                  2
                </Avatar>
                <span style={{ marginLeft: 10 }}>What would you like to visualize from this text?</span>
              </p>
              <TextArea
                placeholder={userInput}
                value={userInput}
                onChange={v => setUserInput(v)}
                style={{ minHeight: 80, background: 'transparent', border: '1px solid #eee' }}
              />
            </div>

            <div className="generate-botton" style={{ alignSelf: "center", marginTop: 20 }}>
              <Button
                loading={loading}
                onClick={() => {
                  askGPTForGenerateData();
                }}
                disabled={!url || !apiKey}
                shape="round"
                type="primary"
              >
                generate data (preview)
              </Button>
            </div>

            <Divider style={{ marginTop: 60 }} />

            <div>
              <p>
                <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
                  3
                </Avatar>
                <span style={{ marginLeft: 10 }}>generate csv format data</span>
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
                placeholder={dataset}
                value={dataset}
                onChange={v => setDataset(v)}
                style={{ minHeight: 160, marginTop: 20, background: 'transparent', border: '1px solid #eee' }}
              />
            </div>

            <div>
              <p>
                <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
                  4
                </Avatar>
                <span style={{ marginLeft: 10 }}>generate instruction</span>
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
                placeholder={instructionByLLM}
                value={instructionByLLM}
                onChange={v => setInstructionByLLM(v)}
                style={{ minHeight: 80, marginTop: 20, background: 'transparent', border: '1px solid #eee' }}
              />
            </div>
          </div>
        )
      }
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
      <div className="generate-botton">
        <Button
          loading={loading}
          onClick={() => {
            inputType === InputType.CSV_INPUT
              ? askGPT(csv, describe)
              : askGPT(dataset, instructionByLLM)
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
