/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import '../index.scss';
import { Avatar, Input, Divider, Button, Select, Modal, Radio } from '@arco-design/web-react';
import { AtomName, LLMManage, Model, Schedule } from '../../../../../src/index';
import { capcutMockV2Data as capcutMockData, capcutMockData as v1MockData } from '../../constants/capcutData';
import { ChartType } from '../../../../../src/types';

const TextArea = Input.TextArea;
const Option = Select.Option;
const RadioGroup = Radio.Group;

type IPropsType = {
  type: 'normal' | 'multiple';
  setType: (value: 'normal' | 'multiple') => void;
  onOk: (text: string, extractCtx: any, dataCleanCtx: any, chartCtx: any[], timeCost: number) => void;
  setLoading: (loading: boolean) => void;
};

const globalVariables = (import.meta as any).env;
const ModelConfigMap: any = {
  [Model.DOUBAO_PRO]: { url: globalVariables.VITE_DOUBAO_URL, key: globalVariables.VITE_DOUBAO_KEY },
  [Model.GPT3_5]: { url: globalVariables.VITE_GPT_URL, key: globalVariables.VITE_GPT_KEY },
  [Model.GPT4]: { url: globalVariables.VITE_GPT_URL, key: globalVariables.VITE_GPT_KEY },
  [Model.GPT_4_0613]: { url: globalVariables.VITE_GPT_URL, key: globalVariables.VITE_GPT_KEY },
  [Model.GPT_4o]: { url: globalVariables.VITE_GPT_URL, key: globalVariables.VITE_GPT_KEY }
};
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export function DataInput(props: IPropsType) {
  const defaultIndex = 0;
  const [text, setText] = useState<string>(capcutMockData[defaultIndex].text);
  const [userInput, setUserInput] = useState<string>(capcutMockData[defaultIndex].input);

  const [model, setModel] = useState<Model>(Model.DOUBAO_PRO);
  const [visible, setVisible] = React.useState(false);
  const [url, setUrl] = React.useState(ModelConfigMap[model]?.url ?? OPENAI_API_URL);
  const [apiKey, setApiKey] = React.useState(ModelConfigMap[model]?.key);
  const llmModel = React.useMemo(() => {
    if (model.endsWith('-advisor')) {
      return model.split('-&&-')[0];
    }
    return model;
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
  const getScheduleByType = React.useCallback(
    (value: string) => {
      if (value === 'normal') {
        return new Schedule(
          [AtomName.DATA_EXTRACT, AtomName.DATA_CLEAN, AtomName.CHART_COMMAND],
          { base: { llm: llm.current, showThoughts: false }, dataExtract: { reGenerateFieldInfo: true } },
          { text }
        );
      }
      return new Schedule([AtomName.DATA_EXTRACT, AtomName.MULTIPLE_DATA_CLEAN, AtomName.MULTIPLE_CHART_COMMAND], {
        base: { llm: llm.current, showThoughts: false },
        dataExtract: { isMultiple: true }
      });
    },
    [text]
  );
  const schedule = React.useRef(getScheduleByType(props.type));
  const chartSchedule = React.useRef(
    new Schedule([AtomName.CHART_GENERATE], {
      base: { llm: llm.current, showThoughts: false },
      chartGenerate: { unsupportChartTypeList: [ChartType.DynamicBarChart, ChartType.MapChart] }
    })
  );
  useEffect(() => {
    llm.current.updateOptions({
      url,
      headers: {
        'api-key': apiKey,
        Authorization: `Bearer ${apiKey}`
      },
      model: llmModel
    });
  }, [url, llmModel, apiKey]);
  const handleQuery = React.useCallback(async () => {
    props.setLoading(true);
    const time1: any = new Date();
    await schedule.current.run(userInput);
    const chartResult = [];
    if (props.type === 'multiple') {
      const { datasets, commands } = schedule.current.getContext() as any;
      for (let i = 0; i < datasets.length; i++) {
        const dataset = datasets[i];
        const { dataTable, fieldInfo, textRange } = dataset;
        chartSchedule.current.setNewTask({
          dataTable,
          fieldInfo,
          command: commands[i]
        });
        chartResult.push({
          context: await chartSchedule.current.run(),
          textRange
        });
      }
    } else {
      const { dataTable, fieldInfo, command } = schedule.current.getContext();
      chartSchedule.current.setNewTask({
        text,
        dataTable,
        fieldInfo,
        command
      });
      chartResult.push({
        context: await chartSchedule.current.run()
      });
    }
    const time2: any = new Date();
    const diff = (time2 - time1) / 1000;
    props.onOk(
      text,
      schedule.current.getContext(AtomName.DATA_EXTRACT),
      schedule.current.getContext(),
      chartResult,
      diff
    );
  }, [chartSchedule, props, text, userInput]);

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
      <div style={{ width: '90%', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div>
          <p>
            <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
              0
            </Avatar>
            <span style={{ marginLeft: 10 }}>Select DataExtraction Type</span>
          </p>
          <Select
            style={{ width: '100%' }}
            defaultValue={props.type}
            onChange={value => {
              props.setType(value);
              schedule.current = getScheduleByType(value);
              if (value === 'multiple') {
                setText(capcutMockData[defaultIndex].text);
                setUserInput(capcutMockData[defaultIndex].input);
              } else {
                setText(v1MockData[defaultIndex].text);
                setUserInput(v1MockData[defaultIndex].input);
              }
            }}
          >
            <Option value={'multiple'}>Multiple</Option>
            <Option value={'normal'}>Normal</Option>
          </Select>
        </div>

        <div>
          <p>
            <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
              1
            </Avatar>
            <span style={{ marginLeft: 10 }}>Select Demo Data (optional)</span>
          </p>
          <Select
            style={{ width: '100%' }}
            defaultValue={defaultIndex}
            onChange={index => {
              const targetMockData = props.type === 'multiple' ? capcutMockData : v1MockData;
              const dataObj = targetMockData[index];
              setText(dataObj.text);
              setUserInput(dataObj.input);
              schedule.current.setNewTask({
                text: dataObj.text
              });
            }}
          >
            {(props.type === 'multiple' ? capcutMockData : v1MockData).map((data, index) => (
              <Option key={index} value={index}>
                {`Demo_${index + 1}`}
              </Option>
            ))}
          </Select>
        </div>

        <div style={{ marginTop: 12 }} className="flex-text-area">
          <p>
            <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
              2
            </Avatar>
            <span style={{ marginLeft: 10 }}>Input your data in text format</span>
          </p>
          <TextArea
            placeholder={text}
            value={text}
            onChange={v => {
              setText(v);
              schedule.current.setNewTask({
                text: v,
                fieldInfo: []
              });
            }}
            style={{ minHeight: 350, background: 'transparent', border: '1px solid #eee' }}
          />
        </div>

        {/* <div style={{ marginTop: 12 }}>
          <p>
            <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
              3
            </Avatar>
            <span style={{ marginLeft: 10 }}>Query to adjust?</span>
          </p>
          <TextArea
            placeholder={userInput}
            value={userInput}
            onChange={v => setUserInput(v)}
            style={{ minHeight: 80, background: 'transparent', border: '1px solid #eee' }}
          />
        </div> */}
      </div>

      <div>
        <Button
          onClick={() => {
            schedule.current.setNewTask({ text });
            handleQuery();
          }}
          style={{ marginTop: 12, marginRight: 12 }}
        >
          ReGenerate
        </Button>
      </div>
      <Divider style={{ marginTop: 12 }} />

      <div style={{ width: '90%', marginBottom: 10 }}>
        <RadioGroup
          value={model}
          onChange={v => {
            setModel(v);
            // const preModel = v.split('-&&-')[0];
            chartSchedule.current = v.endsWith('-advisor')
              ? new Schedule([AtomName.CHART_GENERATE], {
                  chartGenerate: { useChartAdvisor: true, unsupportChartTypeList: [ChartType.DynamicBarChart] }
                })
              : new Schedule([AtomName.CHART_GENERATE], {
                  base: { llm: llm.current, showThoughts: false },
                  chartGenerate: { unsupportChartTypeList: [ChartType.DynamicBarChart] }
                });
          }}
        >
          <Radio value={Model.GPT_4o}>GPT-4o</Radio>
          <Radio value={Model.DOUBAO_PRO}>Doubao-pro</Radio>
          <Radio value={`${Model.GPT_4o}-&&-advisor`}>GPT-4o + chart-advisor</Radio>
          <Radio value={`${Model.DOUBAO_PRO}-&&-advisor`}>Doubao-pro + chart-advisor</Radio>
        </RadioGroup>
      </div>
      {/* <div style={{ width: '90%', marginBottom: 10 }}>
        <Checkbox checked={useFieldInfo} onChange={v => setUseFieldInfo(v)}>
          Use FieldInfo
        </Checkbox>
      </div>
      <div style={{ width: '90%' }}>
        <Checkbox checked={showThoughts} onChange={v => setShowThoughts(v)}>
          Show Thoughts
        </Checkbox>
      </div> */}

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
