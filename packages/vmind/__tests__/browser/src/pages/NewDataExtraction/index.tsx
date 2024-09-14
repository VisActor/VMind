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
  const [loading, setLoading] = useState<boolean>(false);

  const handleOk = React.useCallback(async (dataExtractCtx: any, dataCleanCtx: any) => {
    setDataset(dataExtractCtx.dataTable);
    setFieldInfo(dataExtractCtx.fieldInfo);
    setFianlDataset(dataCleanCtx.dataTable);
    setLoading(false);
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
        <DataTableComp dataset={dataset} finalDataset={finalDataset} fieldInfo={fieldInfo} loading={loading} />
      </Content>
    </Layout>
  );
}