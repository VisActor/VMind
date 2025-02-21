import React, { useState } from 'react';
import { Card, Layout, Spin } from '@arco-design/web-react';
import { DataInput } from './DataInput';
import type { TableProps } from './DataTable';
import { SimpleTable } from './DataTable';
import { ChartPreview } from '../ChartGeneration/ChartPreview';
const Sider = Layout.Sider;
const Content = Layout.Content;

export function DataExtractionPage() {
  const [dataExtractionRes, setDataExtractionRes] = useState<TableProps['data']>([]);
  const [spec, setSpec] = useState<any>('');
  const [specList, setSpecList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [timeCost, setTimeCost] = useState<number>(0);
  const [time, setTime] = useState<{
    totalTime: number;
    frameArr: any[];
  }>();
  const handleOk = React.useCallback(
    async (dataExtractCtx: any, spec: any, specList: any[], time: any, timeCost: number) => {
      setLoading(false);
      setTimeCost(timeCost);
      // eslint-disable-next-line no-console
      console.info(dataExtractCtx, spec);
      setDataExtractionRes([dataExtractCtx]);
      setSpecList(specList);
      setTime(time);
      setSpec(spec);
    },
    []
  );

  return (
    <Layout style={{ overflow: 'auto' }}>
      <Sider
        style={{
          height: '100%',
          minWidth: 325
        }}
      >
        <DataInput onOk={handleOk} setLoading={setLoading} />
      </Sider>
      <Content>
        <div className="right-chart">
          <Spin loading={loading}>
            <div>
              <ChartPreview
                spec={spec}
                specList={specList}
                time={time}
                costTime={timeCost}
                style={{ height: 'auto' }}
              />
              <p style={{ marginTop: 30 }}>Data Table Result:</p>
              <SimpleTable data={dataExtractionRes} />
            </div>
          </Spin>
        </div>
      </Content>
    </Layout>
  );
}
