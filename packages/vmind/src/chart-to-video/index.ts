import { cloneDeep } from 'lodash';
import { OuterPackages, TimeType } from '../typings';

let idx = 0;
export async function _chatToVideoWasm(
  fps: number,
  propsSpec: any,
  propsTime: TimeType,
  outName = 'out',
  outerPackages: OuterPackages
) {
  const { ManualTicker, defaultTimeline, VChart, fetchFile, FFmpeg, createCanvas } = outerPackages;

  idx++;
  const defaultTicker = new ManualTicker();
  const spec = cloneDeep(propsSpec);
  const time = cloneDeep(propsTime);
  const { totalTime, frameArr } = time;

  const width = spec.width ?? 720;
  const height = spec.height ?? 480;
  spec.width = width;
  spec.height = height;

  // 关闭player
  if (frameArr && frameArr.length) {
    spec.player && (spec.player.auto = false);
  }
  defaultTicker.mode = 'manual';

  const canvas = createCanvas(width, height);
  const vchart = new VChart(spec, {
    renderCanvas: canvas,
    mode: 'node',
    dpr: 1,
    disableDirtyBounds: true,
    ticker: defaultTicker,
    options3d: {
      enable: true,
      alpha: 0,
      beta: 0,
      center: { x: 1030, y: 300 },
      fieldRatio: 0.8,
      light: {
        dir: [3, -2, -1],
        color: 'white',
        ambient: 0.7
      }
    }
  });

  const stage = vchart.getStage();
  stage.ticker = defaultTicker;
  stage.ticker.addTimeline(defaultTimeline);

  await vchart.renderAsync();

  const frame = (totalTime / 1000) * fps + 1;
  const player = vchart.getComponents().filter((d: any) => d.type === 'player')[0];
  const shouldControlPlayer = player && frameArr && frameArr.length;
  const t = 1000 / fps;
  let nextFrameTime = 0;
  if (shouldControlPlayer) {
    nextFrameTime = frameArr.shift();
  }
  for (let i = 0; i <= frame; i++) {
    if (shouldControlPlayer) {
      if (t * i > nextFrameTime) {
        nextFrameTime += frameArr.shift() || 0;
        (player as any)._playerComponent.forward();
      }
    }
    defaultTicker.tickTo(t * i);
    vchart.getStage().render();
    const num = `0000${i}`.slice(-3);

    // const size = { width: canvas.width, height: canvas.height };
    // const blob = await new Promise((resolve, reject) => {
    //   canvas.toBlob((blob: any) => {
    //     if (blob) {
    //       const info = {
    //         data: blob,
    //         format: 'PNG',
    //         size
    //       };
    //       console.log(`BBB--------${info}`);
    //       resolve(info);
    //     } else {
    //       console.log('no blob');
    //       reject('no blob');
    //     }
    //   }, `image/png`);
    // });
    const buffer = (canvas as any).toBuffer();

    // defaultTicker.mode = 'raf'
    // const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    // console.log(new Uint8Array(imageData.data.buffer))
    FFmpeg.FS('writeFile', `vchart${idx}.${num}.png`, buffer);
  }

  vchart.release();
  await FFmpeg.run(
    '-framerate',
    '30',
    '-pattern_type',
    'glob',
    '-i',
    '*.png',
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    `${outName}.mp4`
  );
  for (let i = 0; i <= frame; i++) {
    const num = `0000${i}`.slice(-3);
    FFmpeg.FS('unlink', `vchart${idx}.${num}.png`);
  }
  // defaultTicker.mode = 'raf';
}
