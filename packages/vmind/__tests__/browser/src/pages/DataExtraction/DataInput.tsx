import React, { useState, useEffect } from 'react';
import '../index.scss';
import { Avatar, Input, Divider, Button, Select, Checkbox, Modal, Radio, Message } from '@arco-design/web-react';
import VMind, { Model } from '../../../../../src/index';

const TextArea = Input.TextArea;
const Option = Select.Option;
const RadioGroup = Radio.Group;

type IPropsType = {
  onOk: (dataExtractCtx: any, spec: any, specList: any[], time: any, timeCost: number) => void;
  setLoading: (loading: boolean) => void;
};

import {
  mockUserTextInput0,
  mockUserTextInput1,
  mockUserTextInput10,
  mockUserTextInput2,
  mockUserTextInput3,
  mockUserTextInput4,
  mockUserTextInput5,
  mockUserTextInput6,
  mockUserTextInput7,
  mockUserTextInput8,
  mockUserTextInput9
} from '../../constants/mockData';

const demoTextList: { text: string; input?: string }[] = [
  mockUserTextInput0,
  mockUserTextInput1,
  mockUserTextInput10,
  mockUserTextInput2,
  mockUserTextInput3,
  mockUserTextInput4,
  mockUserTextInput5,
  mockUserTextInput6,
  mockUserTextInput7,
  mockUserTextInput8,
  mockUserTextInput9
];
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
  const defaultIndex = 0;
  const [text, setText] = useState<string>(demoTextList[defaultIndex].text);
  const [userInput, setUserInput] = useState<string>(demoTextList[defaultIndex].input || '');

  const [model, setModel] = useState<Model>(Model.GPT_4o);
  const [useDataQuery, setUseDataQuery] = useState<boolean>(false);
  const [showThoughts, setShowThoughts] = useState<boolean>(false);
  const [visible, setVisible] = React.useState(false);
  const [url, setUrl] = React.useState(ModelConfigMap[model]?.url ?? OPENAI_API_URL);
  const [apiKey, setApiKey] = React.useState(ModelConfigMap[model]?.key);

  const vmind: VMind = React.useMemo(() => {
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
    });
  }, [apiKey, model, showThoughts, url]);
  const handleQuery = React.useCallback(async () => {
    props.setLoading(true);
    const time1: any = new Date();
    const { dataTable, fieldInfo, spec, time, chartAdvistorRes } = await vmind.text2Chart(text, userInput, {
      enableDataQuery: useDataQuery,
      theme: 'light'
    });
    const time2: any = new Date();
    const diff = (time2 - time1) / 1000;
    props.onOk(
      { dataTable, fieldInfo },
      spec,
      (chartAdvistorRes || [])?.map(v => v.spec),
      time,
      diff
    );
  }, [props, text, userInput, vmind]);

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
              1
            </Avatar>
            <span style={{ marginLeft: 10 }}>Select Demo Data (optional)</span>
          </p>
          <Select
            style={{ width: '100%' }}
            defaultValue={defaultIndex}
            onChange={index => {
              const dataObj = demoTextList[index];
              setText(dataObj.text);
              setUserInput(dataObj?.input || '');
            }}
          >
            {demoTextList.map((data: any, index) => (
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
            }}
            style={{ background: 'transparent', border: '1px solid #eee' }}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <p>
            <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
              3
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
      </div>

      <Divider style={{ marginTop: 12 }} />

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
          <Radio value={Model.DEEPSEEK_V3}>deepSeek-V3</Radio>
          <Radio value={Model.DEEPSEEK_R1}>deepSeek-R1</Radio>
          <Radio value={Model.GPT_4o}>GPT-4o</Radio>
          <Radio value={globalVariables.VITE_CUSTOM_MODEL}>Your Custom Model</Radio>
        </RadioGroup>
      </div>
      <div style={{ width: '90%', marginBottom: 10 }}>
        <Checkbox checked={useDataQuery} onChange={v => setUseDataQuery(v)}>
          Enable Data Query
        </Checkbox>
      </div>
      <div style={{ width: '90%' }}>
        <Checkbox checked={showThoughts} onChange={v => setShowThoughts(v)}>
          Show Thoughts
        </Checkbox>
      </div>
      <Divider style={{ marginTop: 12 }} />
      <div>
        <Button onClick={handleQuery}>Query</Button>
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
