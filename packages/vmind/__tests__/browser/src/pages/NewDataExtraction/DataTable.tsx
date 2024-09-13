import React from 'react';
import type { DataTable, FieldInfo } from '../../../../../src/index';
import { Card, Input, Spin } from '@arco-design/web-react';

const TextArea = Input.TextArea;

const SimpleTable = ({ data }: { data: DataTable }) => {
  if (data.length === 0) {
    return <div>No data available</div>;
  }

  const columns = Object.keys(data[0]);

  return (
    <table border={1} cellPadding="5" cellSpacing="0">
      <thead>
        <tr>
          {columns.map(column => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column, index) => (
              <td key={column}>{row[column]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

interface Props {
  dataset: DataTable;
  finalDataset: DataTable;
  fieldInfo: FieldInfo[];
  loading: boolean;
}
export const DataTableComp = ({ dataset, finalDataset, fieldInfo, loading }: Props) => {
  return (
    <div className="right-chart">
      <Spin loading={loading}>
        <Card hoverable style={{ flex: 1, background: 'rgb(244, 244, 245)' }}>
          <div>
            <p>DataClean Result:</p>
            <SimpleTable data={finalDataset} />
            <p style={{ marginTop: 30 }}>DataExtration Result:</p>
            <SimpleTable data={dataset} />
            <p>fieldInfo:</p>
            <TextArea value={JSON.stringify(fieldInfo, null, 4)} style={{ height: 300 }}></TextArea>
          </div>
        </Card>
      </Spin>
    </div>
  );
};
