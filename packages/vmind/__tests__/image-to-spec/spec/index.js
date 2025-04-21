const areaBasic = require('./area-basis');
const areaPercent = require('./area-percent');

const barBasic = require('./bar-basic');
const barBiDirection = require('./bar-bi-direction');
const barColorful = require('./bar-colorful');
const barGradient = require('./bar-gradient');
const barGroup = require('./bar-group');
const barHGroup = require('./bar-h-group');
const barHStack = require('./bar-h-stack');
const barHorizontal = require('./bar-horizontal');
const barPercent = require('./bar-percent');
const barStack = require('./bar-stack');
const barTwoDirections = require('./bar-two-directions');

const circlePackingBubble = require('./circle-packing-bubble');
const circlePackingSimple = require('./circle-packing-simple');

const circularProgress = require('./circular-progress');

const dualAxis = require('./dual-axis');

const funnelBasic = require('./funnel-basic');
const funnelComparative = require('./funnel-comparative');
const funnelRect = require('./funnel-rect');
const funnelTransform = require('./funnel-transform');

const gaugeBasic = require('./gauge-basic');
const gaugeSegment = require('./gauge-segment');

const heatmapBasic = require('./heatmap-basic');

const lineBasic = require('./line-basic');
const lineStack = require('./line-stack');
const lineBar = require('./line-bar');
const lineMarkArea = require('./line-mark-area');
const lineMarkline = require('./line-markline');
const lineMultiMarkline = require('./line-multi-markline');
const linearProgressSegment = require('./linear-grogress-segment');
const linearProgress = require('./linear-progress');
const liquidBasic = require('./liquid-basic');
const liquidStar = require('./liquid-star');

// 新增的图表引入
const histogramBasic = require('./histogram-basic');
const histogramDifferentBin = require('./histogram-different-bin');
const pieBasic = require('./pie-basic');
const pieDonut = require('./pie-donut');
const pieNested = require('./pie-nested');
const radarBasic = require('./radar-basic');
const radarGroup = require('./radar-group');
const radarInnerradius = require('./radar-innerradius');
const radarStack = require('./radar-stack');
const rangeBar = require('./range-bar');
const rangeColumn = require('./range-column');
const roseBasis = require('./rose-basis');
const roseGroupStack = require('./rose-group-stack');
const roseGroup = require('./rose-group');
const sankeySimple = require('./sankey-simple');
const scatterBasic = require('./scatter-basic');
const scatterBubble = require('./scatter-bubble');
const scatterMarkline = require('./scatter-markline');
const sunburstBasic = require('./sunburst-basic');
const treemap = require('./treemap');
const vennHollow = require('./venn-hollow');
const vennThree = require('./venn-three');
const waterfallCollect = require('./waterfall-collect');
const waterfallH = require('./waterfall-h');
const waterfallStack = require('./waterfall-stack');
const waterfall = require('./waterfall');
const wordcloudBasic = require('./wordcloud-basic');
const roseStack = require('./rose-stack');

module.exports = {
  // 面积图
  areaBasic,
  areaPercent,

  barBasic,
  barBiDirection,
  barColorful,
  barGradient,
  barGroup,
  barHGroup,
  barHStack,
  barHorizontal,
  barPercent,
  barStack,
  barTwoDirections,

  circlePackingBubble,
  circlePackingSimple,

  circularProgress,

  dualAxis,

  funnelBasic,
  funnelComparative,
  funnelRect,
  funnelTransform,

  gaugeBasic,
  gaugeSegment,

  heatmapBasic,

  lineBasic,
  lineStack,
  lineBar,
  lineMarkArea,
  lineMarkline,
  lineMultiMarkline,
  linearProgressSegment,
  linearProgress,
  liquidBasic,
  liquidStar,

  // 新增的图表导出
  histogramBasic,
  histogramDifferentBin,
  pieBasic,
  pieDonut,
  pieNested,
  radarBasic,
  radarGroup,
  radarInnerradius,
  radarStack,
  rangeBar,
  rangeColumn,
  roseBasis,
  roseGroupStack,
  roseGroup,
  sankeySimple,
  scatterBasic,
  scatterBubble,
  scatterMarkline,
  sunburstBasic,
  treemap,
  vennHollow,
  vennThree,
  waterfallCollect,
  waterfallH,
  waterfallStack,
  waterfall,
  wordcloudBasic,
  roseStack
};
