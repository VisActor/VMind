export const WORDCLOUD_NUM_LIMIT = 100;

export const COLOR_THEMES = {
  default: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55']
};

export const LINEAR_COLOR_THEMES = [
  ['#1DD0F3', '#73EC55'],
  ['#2693FF', '#F6FB17'],
  ['#3259F4', '#FBBB16'],
  ['#1B0CA1', '#FF581D'],
  ['#1DD0F3', '#CB2BC6']
];

export const BASIC_HEAT_MAP_COLOR_THEMES = ['#feedde', '#fdbe85', '#fd8d3c', '#e6550d', '#a63603'];

export const DEFAULT_RANKING_BAR_DURATION = 5000;
export const DEFAULT_ANIMATION_DURATION = 500;
export const ONE_BY_ONE_GROUP_SIZE = 10;
export const DEFAULT_VIDEO_LENGTH = 2000;
export const DEFAULT_PIE_VIDEO_LENGTH = 5000;
export const DEFAULT_VIDEO_LENGTH_LONG = 10000;

export const VIDEO_LENGTH_BY_CHART_TYPE: Record<string, number> = {
  pie: DEFAULT_PIE_VIDEO_LENGTH,
  wordCloud: DEFAULT_VIDEO_LENGTH_LONG,
  wordcloud: DEFAULT_VIDEO_LENGTH_LONG
};

export const DIMENSION_AXIS_ID = 'dimensionAxis';
export const MEASURE_AXIS_LEFT_ID = 'measureAxisLeft';
export const MEASURE_AXIS_RIGHT_ID = 'measureAxisRight';

export const MAIN_SERIES_ID = 'mainSeries';
export const SUB_SERIES_ID = 'subSeries';

export const COLOR_FIELD = '__VMIND_COLOR__';
