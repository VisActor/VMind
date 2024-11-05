import React from 'react';
import { DataType, type DataTable, type FieldInfo } from '../../../../../src/index';
import type { TableColumnProps } from '@arco-design/web-react';
import { Card, Input, Spin, Table, Tooltip } from '@arco-design/web-react';
import { isArray } from '@visactor/vutils';

const TextArea = Input.TextArea;

export interface TableProps {
  data: {
    dataTable: DataTable;
    fieldInfo: FieldInfo[];
  }[];
}
export const SimpleTable = (props: TableProps) => {
  const { data } = props;
  if (data.length === 0) {
    return <div>No data available</div>;
  }
  return data.map((v, index) => {
    const { dataTable, fieldInfo } = v;
    const columns: TableColumnProps[] = fieldInfo.map((info: FieldInfo) => {
      return {
        title: (
          <div className="column-title">
            <Tooltip content={info.fieldName}>{info.fieldName}</Tooltip>
            {info.role === 'measure' && info.unit && <span>{`(${info.unit})`}</span>}
          </div>
        ),
        dataIndex: info.fieldName,
        render: (col: any) => {
          if (info.type === DataType.RATIO && info.ratioGranularity === '%') {
            return isArray(col) ? col.map(v => v * 100).join('-') : `${Number(col) * 100}%`;
          }
          return isArray(col) ? col.join('-') : col;
        }
      };
    });
    return (
      <Table
        key={index}
        data={dataTable}
        columns={columns}
        pagination={{
          hideOnSinglePage: true
        }}
        scroll={{
          x: true
        }}
      />
    );
  });
};

interface Props {
  dataExtractionResult: {
    dataTable: DataTable;
    fieldInfo: FieldInfo[];
  }[];
  dataCleanResult: {
    dataTable: DataTable;
    fieldInfo: FieldInfo[];
  }[];
  loading: boolean;
  style?: any;
}
export const DataTableComp = ({ dataExtractionResult, dataCleanResult, loading, style = {} }: Props) => {
  return (
    <div className="right-chart" style={style}>
      <Spin loading={loading}>
        <Card hoverable style={{ flex: 1, background: 'rgb(244, 244, 245)' }}>
          <div>
            <p>DataClean Result:</p>
            <SimpleTable data={dataCleanResult} />
            <p style={{ marginTop: 30 }}>DataExtration Result:</p>
            <SimpleTable data={dataExtractionResult} />
          </div>
        </Card>
      </Spin>
    </div>
  );
};
