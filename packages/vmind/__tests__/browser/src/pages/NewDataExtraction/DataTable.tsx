import React from 'react';
import type { DataTable, FieldInfo } from '../../../../../src/index';
import type { TableColumnProps } from '@arco-design/web-react';
import { Card, Input, Spin, Table } from '@arco-design/web-react';
import { isArray } from '@visactor/vutils';

const TextArea = Input.TextArea;

const SimpleTable = ({ data, fieldInfo }: { data: DataTable; fieldInfo: FieldInfo[] }) => {
  if (data.length === 0) {
    return <div>No data available</div>;
  }

  const columns: TableColumnProps[] = fieldInfo.map((info: FieldInfo) => {
    return {
      title: info.fieldName,
      dataIndex: info.fieldName,
      render: (col: any) => {
        return isArray(col) ? col.join('-') : col;
      }
    };
  });
  return (
    <Table
      data={data}
      columns={columns}
      pagination={{
        hideOnSinglePage: true
      }}
      scroll={{
        x: true
      }}
    />
  );
};

interface Props {
  dataset: DataTable;
  finalDataset: DataTable;
  fieldInfo: FieldInfo[];
  finalFieldInfo: FieldInfo[];
  loading: boolean;
}
export const DataTableComp = ({ dataset, finalDataset, fieldInfo, finalFieldInfo, loading }: Props) => {
  return (
    <div className="right-chart">
      <Spin loading={loading}>
        <Card hoverable style={{ flex: 1, background: 'rgb(244, 244, 245)' }}>
          <div>
            <p>DataClean Result:</p>
            <SimpleTable data={finalDataset} fieldInfo={finalFieldInfo} />
            <p style={{ marginTop: 30 }}>DataExtration Result:</p>
            <SimpleTable data={dataset} fieldInfo={fieldInfo} />
            <p>fieldInfo:</p>
            <TextArea value={JSON.stringify(fieldInfo, null, 4)} style={{ height: 300 }}></TextArea>
          </div>
        </Card>
      </Spin>
    </div>
  );
};
