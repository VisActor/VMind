/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import '../DataExtraction/index.scss';
import { Avatar, Input, Divider, Button, Select, Checkbox, Modal } from '@arco-design/web-react';
import type { FieldInfo } from '../../../../../src/index';
import { AtomName, LLMManage, Model, Schedule } from '../../../../../src/index';
import { capcutMockData } from '../../constants/capcutData';

const TextArea = Input.TextArea;
const Option = Select.Option;

type IPropsType = {
  onOk: (extractCtx: any, dataCleanCtx: any) => void;
  setLoading: (loading: boolean) => void;
};

const globalVariables = (import.meta as any).env;
const ModelConfigMap: any = {
  [Model.SKYLARK2]: { url: globalVariables.VITE_SKYLARK_URL, key: globalVariables.VITE_SKYLARK_KEY },
  [Model.SKYLARK2_v1_2]: { url: globalVariables.VITE_SKYLARK_URL, key: globalVariables.VITE_SKYLARK_KEY },
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
  const [useFieldInfo, setUseFieldInfo] = useState<boolean>(true);
  const [showThoughts, setShowThoughts] = useState<boolean>(false);
  const [visible, setVisible] = React.useState(false);
  const [url, setUrl] = React.useState(ModelConfigMap[model]?.url ?? OPENAI_API_URL);
  const [apiKey, setApiKey] = React.useState(ModelConfigMap[model]?.key);
  const [fieldInfo, setFieldInfo] = useState<FieldInfo[]>(capcutMockData[defaultIndex].fieldInfo || []);

  const llm = React.useRef<LLMManage>(
    new LLMManage({
      url,
      headers: {
        'api-key': apiKey,
        Authorization: `Bearer ${apiKey}`
      },
      model
    })
  );
  const schedule = React.useRef<Schedule<[AtomName.DATA_EXTRACT]>>(
    new Schedule(
      [AtomName.DATA_EXTRACT, AtomName.DATA_CLEAN],
      { base: { llm: llm.current, showThoughts } },
      { text, fieldInfo: useFieldInfo ? fieldInfo : [] }
    )
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
  useEffect(() => {
    schedule.current.updateOptions({ base: { showThoughts } });
  }, [showThoughts]);
  const handleQuery = React.useCallback(async () => {
    props.setLoading(true);
    await schedule.current.run(userInput);
    props.onOk(schedule.current.getContext(AtomName.DATA_EXTRACT), schedule.current.getContext(AtomName.DATA_CLEAN));
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
            defaultValue={defaultIndex}
            onChange={index => {
              const dataObj = capcutMockData[index];
              setText(dataObj.text);
              setFieldInfo(dataObj.fieldInfo || []);
              setUserInput(dataObj.input);
              schedule.current.setNewTask({
                text: dataObj.text,
                fieldInfo: dataObj.fieldInfo || []
              });
            }}
          >
            {capcutMockData.map((data, index) => (
              <Option key={index} value={index}>
                {`Demo_${index}`}
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

        <div style={{ marginTop: 20 }}>
          <p>
            <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
              2
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

      <Button onClick={handleQuery} style={{ marginTop: 20 }}>
        Generate/Query
      </Button>
      <Divider style={{ marginTop: 20 }} />

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
      <Divider style={{ marginTop: 20 }} />
      <Button onClick={handleQuery} style={{ marginTop: 20 }}>
        Run ALL Test
      </Button>

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
