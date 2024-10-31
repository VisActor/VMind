import React, { useState, useEffect, useRef } from 'react';
import './index.scss';
import { Button, Input, Card, Space, Modal, Spin } from '@arco-design/web-react';
import VChart from '@visactor/vchart';
import { isNil } from '@visactor/vutils';
import type { Insight } from '../../../../../src/atom/dataInsight/type';

type IPropsType = {
  spec: any;
  insights: Insight[];
  costTime: number;
};

export function ChartPreview(props: IPropsType) {
  const [generating, setGenerating] = useState<boolean>(false);
  const vchartRef = useRef<any>(null);

  // const [describe, setDescribe] = useState<string>(mockUserInput6.input);
  // const [csv, setCsv] = useState<string>(mockUserInput6.csv);
  // const [loading, setLoading] = useState<boolean>(false);

  // const askGPT = useCallback(async () => {
  //   setLoading(true);
  //   const spec = await(NLToChartPipe(csv, describe));
  //   props.onSpecGenerate(spec, 3000);
  //   setLoading(false);
  // }, [describe, csv]);

  useEffect(() => {
    //defaultTicker.mode = 'raf';
    const { spec } = props;
    if (!spec) {
      return;
    }
    spec.animation = false;
    if (isNil(vchartRef.current)) {
      const cs = new VChart(spec, {
        dom: 'chart',
        mode: 'desktop-browser',
        dpr: 2,
        disableDirtyBounds: true
      });
      vchartRef.current = cs;
      vchartRef.current.renderAsync();
    } else {
      vchartRef.current.updateSpec(props.spec);
    }
  }, [props]);

  return (
    <div className="right-chart">
      <Spin style={{ flex: 1, display: 'flex', background: 'rgb(244, 244, 245)' }} loading={generating}>
        <Card hoverable style={{ flex: 1, background: 'rgb(244, 244, 245)' }}>
          <div className="right-chart-content">{props.spec ? <div id="chart"></div> : null}</div>
          {props.spec ? (
            <div>
              <p>Total Time: {props.costTime / 1000} s</p>
              <p>insights:</p>
              {props.insights.map((insight, index) => {
                const { plainText = '' } = insight?.textContent || {};
                return <p key={index}>{plainText}</p>;
              })}
            </div>
          ) : null}
        </Card>
      </Spin>
    </div>
  );
}
