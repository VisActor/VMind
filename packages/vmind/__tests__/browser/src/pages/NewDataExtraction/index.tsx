import React, { useState } from 'react';
import { Layout } from '@arco-design/web-react';
import { DataInput } from './DataInput';
import type { TableProps } from './DataTable';
import { DataTableComp } from './DataTable';
const Sider = Layout.Sider;
const Content = Layout.Content;

export function NewDataExtractionPage() {
  const [dataExtractionRes, setDataExtractionRes] = useState<TableProps['data']>([]);
  const [dataCleanRes, setDataCleanRes] = useState<TableProps['data']>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [timeCost, setTimeCost] = useState<number>(0);
  const [type, setType] = useState<'multiple' | 'normal'>('multiple');

  const handleOk = React.useCallback(
    async (dataExtractCtx: any, dataCleanCtx: any, timeCost: number) => {
      setLoading(false);
      setTimeCost(timeCost);
      // eslint-disable-next-line no-console
      console.info(dataExtractCtx, dataCleanCtx);
      if (type === 'multiple') {
        setDataExtractionRes(dataExtractCtx.datasets);
        setDataCleanRes(dataCleanCtx.datasets);
      } else {
        setDataExtractionRes([dataExtractCtx]);
        setDataCleanRes([dataCleanCtx]);
      }
    },
    [type]
  );

  return (
    <Layout style={{ overflow: 'auto' }}>
      <Sider
        style={{
          height: '100%',
          minWidth: 325
        }}
      >
        <DataInput onOk={handleOk} setLoading={setLoading} type={type} setType={setType} />
      </Sider>
      <Content>
        <p>{`Time Cost: ${timeCost.toFixed(1)}s`}</p>
        <DataTableComp dataExtractionResult={dataExtractionRes} dataCleanResult={dataCleanRes} loading={loading} />
      </Content>
    </Layout>
  );
}
