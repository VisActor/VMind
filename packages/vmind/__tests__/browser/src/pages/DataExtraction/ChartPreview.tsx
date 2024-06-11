import React, { useState, useCallback, useEffect, useRef } from 'react';
import './index.scss';
import { Button, Input, Card, Space, Modal, Spin } from '@arco-design/web-react';
import VChart from '@visactor/vchart';
import { isNil } from '@visactor/vutils';

const TextArea = Input.TextArea;

type IPropsType = {
  dataset: any;
  fieldInfo: any;
  instruction: string;
};

export function ChartPreview(props: IPropsType) {
  const [generating, setGenerating] = useState<boolean>(false);

  return (
    <div className="right-chart">
      <Spin style={{ flex: 1, display: 'flex', background: 'rgb(244, 244, 245)' }} loading={generating}>
        <Card hoverable style={{ flex: 1, background: 'rgb(244, 244, 245)' }}>
          <div>
            <p>dataset:</p>
            <TextArea value={JSON.stringify(props.dataset, null, 4)} style={{ height: 300 }}></TextArea>
            <p>fieldInfo:</p>
            <TextArea value={JSON.stringify(props.fieldInfo, null, 4)} style={{ height: 300 }}></TextArea>
            <p>instruction:</p>
            <TextArea value={props.instruction} style={{ height: 300 }}></TextArea>

            {/*<pre style={{ whiteSpace: 'pre' }}>{JSON.stringify(props.spec, null, 4)}</pre>*/}
          </div>
        </Card>
      </Spin>
    </div>
  );
}
