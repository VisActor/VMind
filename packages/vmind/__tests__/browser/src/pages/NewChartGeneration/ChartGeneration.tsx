import React, { useState } from 'react';
import { Layout } from '@arco-design/web-react';
import { DataInput } from './DataInput';
import { ChartPreview } from './ChartPreview';
const Sider = Layout.Sider;
const Content = Layout.Content;

export function NewChartGenerationPage() {
  const [spec, setSpec] = useState<any>('');
  const [command, setCommand] = useState<string>('');
  const [specList, setSpecList] = useState<any>([]);

  const [costTime, setCostTime] = useState<number>(0);
  return (
    <Layout>
      <Sider
        style={{
          height: '100%',
          minWidth: 300
        }}
      >
        <DataInput
          onSpecGenerate={(spec, desc, costTime) => {
            setSpec(spec);
            setCommand(desc);
            setSpecList([]);
            setCostTime(costTime);
          }}
        />
      </Sider>
      <Content>
        <ChartPreview showSpec={true} spec={spec} command={command} specList={specList} costTime={costTime} />
      </Content>
    </Layout>
  );
}
