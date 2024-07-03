import React, { useState } from 'react';
import { Layout } from '@arco-design/web-react';
import { DataInput } from './DataInput';
import { ChartPreview } from './ChartPreview';
import type { SimpleFieldInfo, VMindDataset } from '../../../../../src/common/typings';
const Sider = Layout.Sider;
const Content = Layout.Content;

export function DataExtractionPage() {
  const [dataset, setDataset] = useState<VMindDataset>([]);
  const [fieldInfo, setFieldInfo] = useState<SimpleFieldInfo[]>([]);

  const [instructionByLLM, setInstructionByLLM] = useState<string>('');

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
          onDatasetGenerate={option => {
            const { dataset, fieldInfo, instruction } = option;
            setDataset(dataset);
            setInstructionByLLM(instruction);
            setFieldInfo(fieldInfo);
          }}
        />
      </Sider>
      <Content>
        <ChartPreview dataset={dataset} fieldInfo={fieldInfo} instruction={instructionByLLM} />
      </Content>
    </Layout>
  );
}
