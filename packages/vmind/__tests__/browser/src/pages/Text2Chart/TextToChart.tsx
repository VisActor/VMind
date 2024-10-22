import React, { useState } from 'react';
import { Layout } from '@arco-design/web-react';
import { DataInput } from './DataInput';
import type { TableProps } from '../NewDataExtraction/DataTable';
import { ChartPreview } from './ChartPreview';
const Sider = Layout.Sider;
const Content = Layout.Content;

export function Text2Chart() {
  const [commands, setCommands] = useState<string[]>([]);
  const [specList, setSpecList] = useState<any>([]);
  const [type, setType] = useState<'multiple' | 'normal'>('multiple');
  const [dataExtractionRes, setDataExtractionRes] = useState<TableProps['data']>([]);
  const [dataCleanRes, setDataCleanRes] = useState<TableProps['data']>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [showTabe, setShowTable] = React.useState<boolean>(false);

  const [costTime, setCostTime] = useState<number>(0);
  const handleOk = React.useCallback(
    async (text: string, dataExtractCtx: any, dataCleanCtx: any, chartCtx: any, timeCost: number) => {
      setText(text);
      if (type === 'multiple') {
        setDataExtractionRes(dataExtractCtx.datasets);
        setDataCleanRes(dataCleanCtx.datasets);
      } else {
        setDataExtractionRes([dataExtractCtx]);
        setDataCleanRes([dataCleanCtx]);
      }
      setLoading(false);
      setCostTime(timeCost);
      setSpecList(chartCtx.map((v: any) => v.context.spec));
      setCommands(chartCtx.map((v: any) => v.context.command));
      // eslint-disable-next-line no-console
      console.info(dataExtractCtx, dataCleanCtx, chartCtx);
    },
    [type]
  );
  return (
    <Layout style={{ overflow: 'auto' }}>
      <Sider
        style={{
          height: '100%',
          minWidth: 300
        }}
      >
        <DataInput type={type} setType={setType} onOk={handleOk} setLoading={setLoading} />
      </Sider>
      <Content>
        <p>{`Time Cost: ${costTime.toFixed(1)}s`}</p>
        <ChartPreview
          text={text}
          showTable={showTabe}
          dataExtractionResult={dataExtractionRes as any}
          dataCleanResult={dataCleanRes as any}
          style={{ height: 'auto' }}
          commands={commands}
          specList={specList}
          costTime={costTime}
          loading={loading}
        />
      </Content>
    </Layout>
  );
}
