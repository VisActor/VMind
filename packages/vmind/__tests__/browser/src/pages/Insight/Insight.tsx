import React, { useState } from 'react';
import { Layout } from '@arco-design/web-react';
import { DataInput } from './DataInput';
import { ChartPreview } from './ChartPreview';
const Sider = Layout.Sider;
const Content = Layout.Content;

export function InsightPage() {
  const [spec, setSpec] = useState<any>('');
  const [insights, setInsights] = useState<any>([]);

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
          onInsightGenerate={(insights, spec, costTime) => {
            setSpec(spec);
            setInsights(insights);
            setCostTime(costTime);
          }}
          onSpecChange={(spec: any) => {
            setSpec(spec);
          }}
        />
      </Sider>
      <Content>
        <ChartPreview spec={spec} insights={insights} costTime={costTime} />
      </Content>
    </Layout>
  );
}
