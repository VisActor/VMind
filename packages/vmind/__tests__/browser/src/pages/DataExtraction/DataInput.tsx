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
import type { VMindDataset } from '../../../../../src/common/typings';

const TextArea = Input.TextArea;
const Option = Select.Option;
const RadioGroup = Radio.Group;

type IPropsType = {
  onDatasetGenerate: (payload: any) => void;
};
const demoTextList: { [key: string]: any } = {
  demo0: mockUserTextInput0,
  demo: mockUserTextInput1,
  demo2: mockUserTextInput2,
  demo3: mockUserTextInput3,
  demo4: mockUserTextInput4,
  demo5: mockUserTextInput5,
  demo6: mockUserTextInput6,
  demo7: mockUserTextInput7,
  demo8: mockUserTextInput8,
  demo9: mockUserTextInput9,
  demo10: mockUserTextInput10
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
  const { onDatasetGenerate } = props;
  const defaultDataKeyForTextInput = Object.keys(demoTextList)[0];
  const [text, setText] = useState<string>(demoTextList[defaultDataKeyForTextInput].text);
  const [userInput, setUserInput] = useState<string>(demoTextList[defaultDataKeyForTextInput].input);
  const [dataset, setDataset] = useState<VMindDataset>([]);
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
        Authorization: `Bearer ${apiKey}`
      }
    });
  }, [apiKey, cache, model, showThoughts, url]);

  const askGPTForGenerateData = useCallback(async () => {
    const { instruction, dataset, fieldInfo } = await vmind.extractDataFromText(text, userInput);

    console.log(instruction, dataset, fieldInfo);
    setDataset(dataset);
    setInstructionByLLM(instruction);
    onDatasetGenerate({ dataset, instruction, fieldInfo });
  }, [vmind, text, userInput, onDatasetGenerate]);

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
      <div style={{ width: '90%', display: 'flex', flexDirection: 'column' }}>
        <div>
          <p>
            <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
              0
            </Avatar>
            <span style={{ marginLeft: 10 }}>Select Demo Data (optional)</span>
          </p>
          <Select
            style={{ width: '100%' }}
            defaultValue={defaultDataKeyForTextInput}
            onChange={v => {
              const dataObj = demoTextList[v];
              setText(dataObj.text);
              setUserInput(dataObj.input);
            }}
          >
            {Object.keys(demoTextList).map(name => (
              <Option key={name} value={name}>
                {name}
              </Option>
            ))}
          </Select>
        </div>

        <div style={{ marginTop: 20 }}>
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

        <div style={{ marginTop: 20 }}>
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
      </div>

      <Divider style={{ marginTop: 30 }} />

      <div style={{ width: '90%', marginBottom: 10 }}>
        <RadioGroup value={model} onChange={v => setModel(v)}>
          <Radio value={Model.GPT3_5}>GPT-3.5</Radio>
          <Radio value={Model.GPT_4_0613}>GPT-4-0613</Radio>
          <Radio value={Model.SKYLARK2}>skylark2 pro</Radio>
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
      <Divider style={{ marginTop: 30 }} />

      <div className="generate-botton" style={{ alignSelf: 'center', marginTop: 20 }}>
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
