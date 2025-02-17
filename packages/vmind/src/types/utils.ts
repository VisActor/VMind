import type { FFmpeg } from '@ffmpeg/ffmpeg';
import type { ManualTicker, DefaultTimeline } from '@visactor/vrender-core';

export type TimeType = {
  totalTime: number;
  frameArr: any[];
};

export type OuterPackages = {
  VChart: any;
  FFmpeg: FFmpeg;
  fetchFile: (data: string | Buffer | Blob | File) => Promise<Uint8Array>;
  ManualTicker: typeof ManualTicker;
  defaultTimeline: DefaultTimeline;
  createCanvas: any;
};
