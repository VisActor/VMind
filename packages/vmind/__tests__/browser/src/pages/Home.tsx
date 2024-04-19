import React, { useState } from 'react';
import { Layout } from '@arco-design/web-react';
import { DataInput } from './DataInput';
import { ChartPreview } from './ChartPreview';
const Sider = Layout.Sider;
const Content = Layout.Content;

export function Home() {
  const [spec, setSpec] = useState<any>('');
  const [specList, setSpecList] = useState<any>([]);

  const [time, setTime] = useState<{
    totalTime: number;
    frameArr: any[];
  }>();
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
          onSpecGenerate={(spec, time, costTime) => {
            setSpec(spec);
            setSpecList([]);
            setTime(time);
            setCostTime(costTime);
          }}
          onSpecListGenerate={(specList: any[], time: any, costTime: number) => {
            setSpec(undefined);
            setSpecList(specList);
            setTime(time);
            setCostTime(costTime);
          }}
        />
      </Sider>
      <Content>
        <ChartPreview spec={spec} specList={specList} time={time} costTime={costTime} />
      </Content>
    </Layout>
  );
}
