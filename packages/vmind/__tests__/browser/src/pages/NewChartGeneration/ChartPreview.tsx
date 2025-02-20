import React, { useState, useEffect, useRef } from 'react';
import '../index.scss';
import { Input, Card, Modal, Spin } from '@arco-design/web-react';
import VChart, { registerLiquidChart } from '@visactor/vchart';
import { isNil } from '@visactor/vutils';

const TextArea = Input.TextArea;

type IPropsType = {
  command: string;
  spec: any;
  specList?: any;
  costTime: number;
  showTime?: boolean;
  showSpec?: boolean;
  style?: any;
};

function downloadGif(link: string, filename = 'out') {
  const a = document.createElement('a');
  a.href = link;
  a.download = `${filename}.gif`;
  a.dispatchEvent(new MouseEvent('click'));
}

function downloadVideo(link: string, filename = 'out') {
  const a = document.createElement('a');
  a.href = link;
  a.download = `${filename}.mp4`;
  a.dispatchEvent(new MouseEvent('click'));
}

registerLiquidChart();

export function ChartPreview(props: IPropsType) {
  const [generating, setGenerating] = useState<boolean>(false);
  const [outType, setOutType] = useState<'gif' | 'video' | ''>('');
  const [src, setSrc] = useState('');
  const vchartRef = useRef<any>(null);

  useEffect(() => {
    const { spec } = props;
    if (!spec) {
      vchartRef.current = null;
      return;
    }
    //spec.animation = false;
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

  useEffect(() => {
    //defaultTicker.mode = 'raf';
    const { specList } = props;
    specList.forEach((spec: any, index: number) => {
      (document.getElementById(`chart-${index}`) as any).innerHTML = '';
      const cs = new VChart(spec, {
        dom: `chart-${index}`,
        mode: 'desktop-browser',
        dpr: 2,
        disableDirtyBounds: true
      });
      cs.renderAsync();
    });
  }, [props]);

  return (
    <div className="right-chart" style={props.style}>
      <Modal
        title={outType}
        visible={!!outType}
        style={{ width: '' }}
        okText="下载"
        onOk={() => {
          setOutType('');
          if (outType === 'gif') {
            downloadGif(src);
          } else {
            downloadVideo(src);
          }
        }}
        onCancel={() => setOutType('')}
      >
        {outType === 'gif' ? <img src={src} /> : <video controls src={src} />}
      </Modal>
      <Spin style={{ flex: 1, display: 'flex', background: 'rgb(244, 244, 245)' }} loading={generating}>
        <Card hoverable style={{ flex: 1, background: 'rgb(244, 244, 245)' }}>
          <div>
            <p>Command: {props.command}</p>
          </div>
          <div className="right-chart-content">
            {props.spec ? <div id="chart" style={{ height: 300, width: 500 }}></div> : null}
          </div>
          {props.spec && props.showSpec ? (
            <div>
              <p>Total Time: {props.costTime / 1000} s</p>
              <p>spec:</p>
              <TextArea value={JSON.stringify(props.spec, null, 4)} style={{ height: 300 }}></TextArea>
              {/*<pre style={{ whiteSpace: 'pre' }}>{JSON.stringify(props.spec, null, 4)}</pre>*/}
            </div>
          ) : null}
        </Card>
      </Spin>
    </div>
  );
}
