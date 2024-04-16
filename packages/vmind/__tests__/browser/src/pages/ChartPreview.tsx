import React, { useState, useCallback, useEffect } from 'react';
import './index.scss';
import { Button, Input, Card, Space, Modal, Spin } from '@arco-design/web-react';
import VChart from '@visactor/vchart';
import { ManualTicker, defaultTimeline } from '@visactor/vrender-core';
import VMind from '../../../../src';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { createCanvas } from 'canvas';

const TextArea = Input.TextArea;

type IPropsType = {
  spec: any;
  specList?: any;
  time:
  | {
    totalTime: number;
    frameArr: any[];
  }
  | undefined;
  costTime: number;
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

export function ChartPreview(props: IPropsType) {
  const [generating, setGenerating] = useState<boolean>(false);
  const [outType, setOutType] = useState<'gif' | 'video' | ''>('');
  const [src, setSrc] = useState('');

  const vmind = new VMind({});
  // const [describe, setDescribe] = useState<string>(mockUserInput6.input);
  // const [csv, setCsv] = useState<string>(mockUserInput6.csv);
  // const [loading, setLoading] = useState<boolean>(false);

  // const askGPT = useCallback(async () => {
  //   setLoading(true);
  //   const spec = await(NLToChartPipe(csv, describe));
  //   props.onSpecGenerate(spec, 3000);
  //   setLoading(false);
  // }, [describe, csv]);
  const generateVideo = useCallback(async () => {
    const { spec, time } = props;
    if (!time || !spec) {
      return;
    }
    setGenerating(true);
    const ffmpeg = createFFmpeg({
      log: true
    });
    await ffmpeg.load();
    const data = await vmind.exportVideo(spec, time, {
      VChart,
      FFmpeg: ffmpeg,
      fetchFile,
      ManualTicker,
      defaultTimeline,
      createCanvas
    } as any);
    const src = URL.createObjectURL(new Blob([data], { type: 'video/mp4' }));
    setSrc(src);
    setOutType('video');
    setGenerating(false);
  }, [props, vmind]);

  const generateGif = useCallback(async () => {
    const { spec, time } = props;
    if (!time || !spec) {
      return;
    }
    setGenerating(true);
    const ffmpeg = createFFmpeg({
      log: true
    });
    await ffmpeg.load();
    const data = await vmind.exportGIF(spec, time, {
      VChart,
      FFmpeg: ffmpeg,
      fetchFile,
      ManualTicker,
      defaultTimeline,
      createCanvas
    } as any);
    const src = URL.createObjectURL(new Blob([data], { type: 'video/mp4' }));
    setSrc(src);
    setOutType('gif');
    setGenerating(false);
    // downloadVideo(src);
  }, [props, vmind]);

  useEffect(() => {
    //defaultTicker.mode = 'raf';
    const { spec, time } = props;
    if (!time || !spec) {
      return;
    }
    const cs = new VChart(spec, {
      dom: 'chart',
      mode: 'desktop-browser',
      dpr: 2,
      disableDirtyBounds: true
    });
    cs.renderAsync();
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
    <div className="right-chart">
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
          <div className="right-chart-title">
            <Space>
              <Button
                disabled={!(!!props.spec && !!props.time)}
                size="small"
                onClick={() => {
                  generateGif();
                }}
                shape="round"
                type="primary"
              >
                export GIF
              </Button>
              <Button
                disabled={!(!!props.spec && !!props.time)}
                size="small"
                onClick={() => {
                  generateVideo();
                }}
                shape="round"
                type="primary"
              >
                export Video
              </Button>
            </Space>
          </div>
          <div className="right-chart-content">
            {props.spec ? <div id="chart"></div> : null}
            <div id="chartListContainer">
              {(props.specList ?? []).map((spec, index: number) => (
                <div key={`chart-${index}`} id={`chart-${index}`}></div>
              ))}
            </div>
          </div>
          {props.spec ? (
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
