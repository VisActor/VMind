import React, { useState } from 'react';
import { Layout } from '@arco-design/web-react';
import { DataInput } from './DataInput';
import { DataTableComp } from './DataTable';
import type { DataTable } from '../../../../../src';
import type { FieldInfo } from '../../../../../src';
const Sider = Layout.Sider;
const Content = Layout.Content;

export function NewDataExtractionPage() {
  const [dataset, setDataset] = useState<DataTable>([]);
  const [finalDataset, setFianlDataset] = useState<DataTable>([]);
  const [fieldInfo, setFieldInfo] = useState<FieldInfo[]>([]);
  const [finalFieldInfo, setFinalFieldInfo] = useState<FieldInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [timeCost, setTimeCost] = useState<number>(0);

  const handleOk = React.useCallback(async (dataExtractCtx: any, dataCleanCtx: any, timeCost: number) => {
    setDataset(dataExtractCtx.dataTable);
    setFieldInfo(dataExtractCtx.fieldInfo);
    setFianlDataset(dataCleanCtx.dataTable);
    setFinalFieldInfo(dataCleanCtx.fieldInfo);
    setLoading(false);
    setTimeCost(timeCost);
    // eslint-disable-next-line no-console
    console.info(dataExtractCtx, dataCleanCtx);
  }, []);

  return (
    <Layout>
      <Sider
        style={{
          height: '100%',
          minWidth: 300
        }}
      >
        <DataInput onOk={handleOk} setLoading={setLoading} />
      </Sider>
      <Content>
        <p>{`Time Cost: ${timeCost.toFixed(1)}s`}</p>
        <DataTableComp
          dataset={dataset}
          finalDataset={finalDataset}
          fieldInfo={fieldInfo}
          finalFieldInfo={finalFieldInfo}
          loading={loading}
        />
      </Content>
    </Layout>
  );
}
