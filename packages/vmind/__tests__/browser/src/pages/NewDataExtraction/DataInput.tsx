import React, { useState, useEffect } from 'react';
import '../index.scss';
import { Avatar, Input, Divider, Button, Select, Checkbox, Modal, Radio } from '@arco-design/web-react';
import type { FieldInfo } from '../../../../../src/index';
import { AtomName, LLMManage, Model, Schedule } from '../../../../../src/index';
import { capcutMockV2Data as capcutMockData } from '../../constants/capcutData';

const TextArea = Input.TextArea;
const Option = Select.Option;
const RadioGroup = Radio.Group;

type IPropsType = {
  type: 'normal' | 'multiple';
  onOk: (extractCtx: any, dataCleanCtx: any, timeCost: number) => void;
  setLoading: (loading: boolean) => void;
  setType: (value: 'normal' | 'multiple') => void;
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

  const [model, setModel] = useState<Model>(Model.GPT_4o);
  const [useFieldInfo, setUseFieldInfo] = useState<boolean>(false);
  const [showThoughts, setShowThoughts] = useState<boolean>(false);
  const [visible, setVisible] = React.useState(false);
  const [url, setUrl] = React.useState(ModelConfigMap[model]?.url ?? OPENAI_API_URL);
  const [apiKey, setApiKey] = React.useState(ModelConfigMap[model]?.key);
  const [fieldInfo, setFieldInfo] = useState<FieldInfo[]>(capcutMockData[defaultIndex].fieldInfo || []);

  const getScheduleByType = React.useCallback(
    (value: string) => {
      if (value === 'normal') {
        return new Schedule(
          [AtomName.DATA_EXTRACT, AtomName.DATA_CLEAN],
          { base: { llm: llm.current, showThoughts }, dataExtract: { reGenerateFieldInfo: true } },
          { text, fieldInfo: useFieldInfo ? fieldInfo : [] }
        );
      }
      return new Schedule([AtomName.DATA_EXTRACT, AtomName.MULTIPLE_DATA_CLEAN], {
        base: { llm: llm.current, showThoughts },
        dataExtract: { isMultiple: true }
      });
    },
    [fieldInfo, showThoughts, text, useFieldInfo]
  );

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

  const schedule = React.useRef(getScheduleByType(props.type));
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
  useEffect(() => {
    schedule.current.updateOptions({ base: { showThoughts } });
  }, [showThoughts, useFieldInfo]);
  const handleQuery = React.useCallback(async () => {
    props.setLoading(true);
    const time1: any = new Date();
    await schedule.current.run(userInput);
    const time2: any = new Date();
    const diff = (time2 - time1) / 1000;
    props.onOk(
      schedule.current.getContext(AtomName.DATA_EXTRACT),
      schedule.current.getContext(props.type === 'normal' ? AtomName.DATA_CLEAN : AtomName.MULTIPLE_DATA_CLEAN),
      diff
    );
  }, [props, userInput]);

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
              const dataObj = capcutMockData[index];
              setText(dataObj.text);
              setFieldInfo((dataObj.fieldInfo || []).map((v: any) => ({ fieldName: v })) || []);
              setUserInput(dataObj.input);
              schedule.current.setNewTask({
                text: dataObj.text,
                fieldInfo: dataObj.fieldInfo || []
              });
            }}
          >
            {capcutMockData.map((data, index) => (
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
            style={{ background: 'transparent', border: '1px solid #eee' }}
          />
        </div>

        <div style={{ marginTop: 12 }}>
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
        </div>
      </div>

      <div>
        <Button
          onClick={() => {
            schedule.current.setNewTask({ text, fieldInfo: useFieldInfo ? fieldInfo : [] });
            handleQuery();
          }}
          style={{ marginTop: 12, marginRight: 12 }}
        >
          ReGenerate
        </Button>
        <Button onClick={handleQuery} style={{ marginTop: 12 }}>
          Query
        </Button>
      </div>
      <Divider style={{ marginTop: 12 }} />

      <div style={{ width: '90%', marginBottom: 10 }}>
        <RadioGroup value={model} onChange={v => setModel(v)}>
          <Radio value={Model.GPT_4o}>GPT-4-0613</Radio>
          <Radio value={Model.DOUBAO_PRO}>Doubao-pro</Radio>
        </RadioGroup>
      </div>
      <div style={{ width: '90%', marginBottom: 10 }}>
        <Checkbox checked={useFieldInfo} onChange={v => setUseFieldInfo(v)}>
          Use FieldInfo
        </Checkbox>
      </div>
      <div style={{ width: '90%' }}>
        <Checkbox checked={showThoughts} onChange={v => setShowThoughts(v)}>
          Show Thoughts
        </Checkbox>
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
