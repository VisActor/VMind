import React, { useState } from 'react';
import { Layout } from '@arco-design/web-react';
import { DataInput } from './DataInput';
import type { DataTable, FieldInfo } from '../../../../../src';
import { DataTableComp } from '../NewDataExtraction/DataTable';
import { ChartPreview } from '../NewChartGeneration/ChartPreview';
const Sider = Layout.Sider;
const Content = Layout.Content;

export function Text2Chart() {
  const [spec, setSpec] = useState<any>('');
  const [command, setCommand] = useState<string>('');
  const [specList, setSpecList] = useState<any>([]);
  const [dataset, setDataset] = useState<DataTable>([]);
  const [finalDataset, setFianlDataset] = useState<DataTable>([]);
  const [fieldInfo, setFieldInfo] = useState<FieldInfo[]>([]);
  const [finalFieldInfo, setFinalFieldInfo] = useState<FieldInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [costTime, setCostTime] = useState<number>(0);
  const handleOk = React.useCallback(
    async (dataExtractCtx: any, dataCleanCtx: any, chartCtx: any, timeCost: number) => {
      setDataset(dataExtractCtx.dataTable);
      setFieldInfo(dataExtractCtx.fieldInfo);
      setFianlDataset(dataCleanCtx.dataTable);
      setFinalFieldInfo(dataCleanCtx.fieldInfo);
      setLoading(false);
      setCostTime(timeCost);
      setSpec(chartCtx.spec);
      setCommand(chartCtx.command);
      // eslint-disable-next-line no-console
      console.info(dataExtractCtx, dataCleanCtx, chartCtx);
    },
    []
  );
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
        <p>{`Time Cost: ${costTime.toFixed(1)}s`}</p>
        <ChartPreview
          style={{ height: 'auto' }}
          spec={spec}
          command={command}
          specList={specList}
          costTime={costTime}
        />
        <DataTableComp
          style={{ height: 'auto' }}
          showFieldInfo={false}
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
