/* eslint-disable no-console */
import React, { useState, useCallback, useMemo } from 'react';
import '../index.scss';
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
  SalesRecordsData,
  gmvData,
  mockProgressData,
  liquidData,
  bubbleCirclePackingData,
  rangeColumnChartData,
  sunburstChartData,
  treemapChartData,
  gaugeChartData,
  linearProgressChartData,
  basicHeatMapChartData,
  vennChartData,
  mapChartData
  // singleColumnLineCombinationChartData,
  // singleColumnLineCombinationChartData1,
  // singleColumnBarCombinationChartData1,
  // singleColumnBarCombinationChartData,
  // dynamicScatterPlotData,
  // dynamicRoseData,
  // dynamicRoseData1,
  // sequenceData
} from '../../constants/mockData';
import VMind, { ArcoTheme } from '../../../../../src/index';
import { Model } from '../../../../../src/index';
import VChart from '@visactor/vchart';
import axios from 'axios';

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
  gmv: gmvData,
  'Electric vehicle sales': carSaleMockData,
  'College entrance examination': acceptRatioData,
  'Shopping Mall Sales Performance': mallSalesData,
  'Global GDP': mockUserInput6Eng,
  'Sales of different drinkings': mockUserInput3Eng,
  'Multi measure': mockUserInput17,
  DataQuery: mockUserInput18,
  salesData: SalesRecordsData,
  progress: mockProgressData,
  liquid: liquidData,
  BubbleCirclePacking: bubbleCirclePackingData,
  Map: mapChartData,
  RangeColumn: rangeColumnChartData,
  Sunburst: sunburstChartData,
  TreeMap: treemapChartData,
  Gauge: gaugeChartData,
  LinearProgress: linearProgressChartData,
  BasicHeatMap: basicHeatMapChartData,
  Venn: vennChartData
  // SingleColumnLineCommon: singleColumnLineCombinationChartData,
  // SingleColumnLineCommon1: singleColumnLineCombinationChartData1,
  // SingleColumnBarCommon: singleColumnBarCombinationChartData,
  // SingleColumnBarCommon1: singleColumnBarCombinationChartData1,
  // dynamicScatterPlotData: dynamicScatterPlotData,
  // dynamicRoseData: dynamicRoseData,
  // dynamicRoseData1: dynamicRoseData1,
  // sequenceData: sequenceData
};

const globalVariables = (import.meta as any).env;
const ModelConfigMap: Record<string, { url: string; key: string }> = {
  [Model.GPT3_5]: { url: globalVariables.VITE_GPT_URL, key: globalVariables.VITE_GPT_KEY },
  [Model.GPT4]: { url: globalVariables.VITE_GPT_URL, key: globalVariables.VITE_GPT_KEY },
  [Model.GPT_4o]: { url: globalVariables.VITE_GPT_URL, key: globalVariables.VITE_GPT_KEY },
  [Model.DEEPSEEK_R1]: { url: globalVariables.VITE_DEEPSEEK_URL, key: globalVariables.VITE_DEEPSEEK_KEY },
  [Model.DEEPSEEK_V3]: { url: globalVariables.VITE_DEEPSEEK_URL, key: globalVariables.VITE_DEEPSEEK_KEY },
  [globalVariables.VITE_CUSTOM_MODEL || 'Custom']: {
    url: globalVariables.VITE_CUSTOM_URL,
    key: globalVariables.VITE_CUSTOM_KEY
  }
};
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const MAP_CHART_BASEMAP = 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/geojson/world.json';
const specTemplateTest = false;
export function DataInput(props: IPropsType) {
  const defaultDataKey = Object.keys(demoDataList)[3];
  const [image, setImage] = useState<string>();
  const [describe, setDescribe] = useState<string>(demoDataList[defaultDataKey].input);
  const [csv, setCsv] = useState<string>(demoDataList[defaultDataKey].csv);
  //const [spec, setSpec] = useState<string>('');
  //const [time, setTime] = useState<number>(1000);
  const [model, setModel] = useState<Model>(Model.GPT_4o);
  const [useDataQuery, setUseDataQuery] = useState<boolean>(false);
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
      showThoughts: showThoughts,
      headers: {
        //must has Authorization: `Bearer ${openAIKey}` if use openai api
        Authorization: `Bearer ${apiKey}`,
        'api-key': apiKey
      }
      // custom request test
      // customRequestFunc: {
      //   chartAdvisor: async (messages, tools, options) => {
      //     return await axios(url, {
      //       method: 'POST',
      //       headers: options!.headers as any,
      //       data: {
      //         model: Model.DOUBAO_PRO_32K,
      //         messages,
      //         tools,
      //         stream: false
      //       }
      //     }).then(response => response.data);
      //   },
      //   chartCommand: async (messages, tools, options) => {
      //     return {
      //       logId: '111',
      //       id: '111',
      //       choices: [
      //         {
      //           index: 0,
      //           message: {
      //             role: 'assistant',
      //             content: ''
      //           },
      //           finish_reason: 'stop'
      //         }
      //       ],
      //       usage: {
      //         prompt_tokens: 1,
      //         completion_tokens: 1,
      //         total_tokens: 2
      //       }
      //     };
      //   }
      // }
    });
  }, [apiKey, model, showThoughts, url]);

  const askGPT = useCallback(async () => {
    //setLoading(true);
    //const { fieldInfo: fieldInfoQuery, dataset: datasetQuery } = await vmind?.dataQuery(describe, fieldInfo, dataset);
    //const dataset = mockData4;
    //const fieldInfo = vmind?.getFieldInfo(dataset);
    const dataset = image ? undefined : vmind.parseCSVData(csv).dataset;

    const finalDataset = specTemplateTest && model !== Model.CHART_ADVISOR ? undefined : dataset;

    const startTime = new Date().getTime();

    // The map chart requires the user to register a base map named map in advance using VChart.registerMap
    if (csv === demoDataList.Map.csv) {
      const response = await fetch(MAP_CHART_BASEMAP);
      const geoJson = await response.json();
      VChart.registerMap('map', geoJson);
    }
    const { spec, chartAdvistorRes, time } = await vmind.generateChart(describe, undefined, finalDataset, {
      image,
      enableDataQuery: useDataQuery,
      //chartTypeList: [ChartType.BarChart, ChartType.LineChart],
      // colorPalette: ArcoTheme.colorScheme,
      theme: 'light'
    });
    const endTime = new Date().getTime();
    console.log((vmind as any).data2ChartSchedule.getContext());
    if (chartAdvistorRes?.length) {
      props.onSpecListGenerate(
        chartAdvistorRes.map(v => (specTemplateTest ? vmind.fillSpecWithData(v.spec, dataset) : v.spec))
      );
    } else {
      const finalSpec = specTemplateTest ? vmind.fillSpecWithData(spec, dataset) : spec;

      const costTime = endTime - startTime;
      props.onSpecGenerate(finalSpec, time as any, costTime);
    }

    setLoading(false);
  }, [vmind, csv, model, describe, useDataQuery, props, image]);

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
      <div style={{ width: '90%', marginBottom: 20 }}>
        <p>
          <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
            0
          </Avatar>
          <span style={{ marginLeft: 10 }}>Select Demo Data or image (optional)</span>
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

        <Upload
          style={{ marginTop: 12 }}
          drag
          multiple={false}
          accept="image/*"
          listType="picture-card"
          imagePreview
          onDrop={e => {
            const uploadFile = e.dataTransfer.files[0];
            if (!uploadFile.type.startsWith('image/')) {
              Message.info('Please upload image files only');
              return;
            }
          }}
          onRemove={(a, b) => {
            setImage(undefined);
          }}
          fileList={image ? [{ url: image, uid: url }] : []}
          customRequest={option => {
            const { file, onError, onSuccess } = option;
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => {
              const result = reader.result;
              if (!result) {
                onError?.();
                return;
              }

              setImage(result as string);
              // Handle the image data as needed
              onSuccess?.();
            });
          }}
          tip="Only images can be uploaded"
        />
      </div>

      <div style={image ? { display: 'none' } : {}}>
        <div>
          <p className={image ? 'disabled-row' : ''}>
            <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
              1
            </Avatar>
            <span style={{ marginLeft: 10 }}>What would you like to visualize?</span>
          </p>

          <TextArea
            disabled={!!image}
            placeholder={describe}
            value={describe}
            onChange={v => setDescribe(v)}
            style={{ minHeight: 80, marginTop: 12, background: 'transparent', border: '1px solid #eee' }}
          />
        </div>
        <Divider style={{ marginTop: 24 }} />
        <div className="flex-text-area">
          <p className={image ? 'disabled-row' : ''}>
            <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
              2
            </Avatar>
            <span style={{ marginLeft: 10 }}>Input your data file in csv format</span>
          </p>

          <TextArea
            disabled={!!image}
            placeholder={csv}
            value={csv}
            onChange={v => setCsv(v)}
            style={{ minHeight: 160, marginTop: 12, background: 'transparent', border: '1px solid #eee' }}
          />
        </div>
      </div>

      <Divider style={{ marginTop: 24 }} />
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
            marginTop: 12,
            background: 'transparent',
            border: '1px solid #eee'
          }}
        />
        <InputNumber defaultValue={time} onChange={v => setTime(v)}></InputNumber>
      </div>*/}
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
          <Radio value={Model.GPT_4o}>GPT-4o</Radio>
          <Radio value={Model.CHART_ADVISOR}>chart-advisor</Radio>
          <Radio value={Model.DEEPSEEK_V3}>deepSeek-V3</Radio>
          <Radio value={Model.DEEPSEEK_R1}>deepSeek-R1</Radio>
          <Radio value={globalVariables.VITE_CUSTOM_MODEL}>Your Custom Model</Radio>
        </RadioGroup>
      </div>
      <div style={{ width: '90%', marginBottom: 10 }}>
        <Checkbox checked={useDataQuery} onChange={v => setUseDataQuery(v)}>
          Enable Data Query
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
