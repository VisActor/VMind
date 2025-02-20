/* eslint-disable max-len */
export const commonKeys = [
  'data',
  'label',
  'background',
  'totalLabel',
  'region',
  'axes',
  'legends',
  'series',
  'total',
  'tooltip',
  'markLine',
  'indicator',
  'title',
  'scrollBar',
  'crosshair',
  'markPoint',
  'markArea',
  'theme',
  'customMark',
  'brush',
  'extensionMark',
  'player',
  'dataZoom',
  'direction',
  'padding',
  'seriesStyle',
  'hover',
  'select',
  'animationThreshold',
  'color',
  'width',
  'height',
  'autoFit',
  'layout',
  'scales',
  'media'
];

const chartFileMapping = {
  areaChart: [
    'option.areaChart-axes-band.json',
    'option.areaChart-axes-linear.json',
    'option.areaChart-axes-log.json',
    'option.areaChart-axes-symlog.json',
    'option.areaChart-axes-time.json',
    'option.areaChart-legends-color.json',
    'option.areaChart-legends-discrete.json',
    'option.areaChart-legends-size.json'
  ],
  bar3dChart: [
    'option.bar3dChart-axes-band.json',
    'option.bar3dChart-axes-linear.json',
    'option.bar3dChart-axes-log.json',
    'option.bar3dChart-axes-symlog.json',
    'option.bar3dChart-axes-time.json',
    'option.bar3dChart-legends-color.json',
    'option.bar3dChart-legends-discrete.json',
    'option.bar3dChart-legends-size.json'
  ],
  barChart: [
    'option.barChart-axes-band.json',
    'option.barChart-axes-linear.json',
    'option.barChart-axes-log.json',
    'option.barChart-axes-symlog.json',
    'option.barChart-axes-time.json',
    'option.barChart-legends-color.json',
    'option.barChart-legends-discrete.json',
    'option.barChart-legends-size.json'
  ],
  boxPlotChart: [
    'option.boxPlotChart-axes-band.json',
    'option.boxPlotChart-axes-linear.json',
    'option.boxPlotChart-axes-log.json',
    'option.boxPlotChart-axes-symlog.json',
    'option.boxPlotChart-axes-time.json',
    'option.boxPlotChart-legends-color.json',
    'option.boxPlotChart-legends-discrete.json',
    'option.boxPlotChart-legends-size.json'
  ],
  circlePackingChart: [
    'option.circlePackingChart-legends-color.json',
    'option.circlePackingChart-legends-discrete.json',
    'option.circlePackingChart-legends-size.json'
  ],
  circularProgressChart: [
    'option.circularProgressChart-axes-band.json',
    'option.circularProgressChart-axes-linear.json',
    'option.circularProgressChart-legends-color.json',
    'option.circularProgressChart-legends-discrete.json',
    'option.circularProgressChart-legends-size.json'
  ],
  commonChart: [
    'option.commonChart-axes-band.json',
    'option.commonChart-axes-linear.json',
    'option.commonChart-axes-log.json',
    'option.commonChart-axes-symlog.json',
    'option.commonChart-axes-time.json',
    'option.commonChart-legends-color.json',
    'option.commonChart-legends-discrete.json',
    'option.commonChart-legends-size.json',
    'option.commonChart-series-area.json',
    'option.commonChart-series-bar.json',
    'option.commonChart-series-boxPlot.json',
    'option.commonChart-series-circlePacking.json',
    'option.commonChart-series-dot.json',
    'option.commonChart-series-funnel.json',
    'option.commonChart-series-heatmap.json',
    'option.commonChart-series-line.json',
    'option.commonChart-series-linearProgress.json',
    'option.commonChart-series-link.json',
    'option.commonChart-series-map.json',
    'option.commonChart-series-radar.json',
    'option.commonChart-series-rangeArea.json',
    'option.commonChart-series-rangeColumn.json',
    'option.commonChart-series-rose.json',
    'option.commonChart-series-sankey.json',
    'option.commonChart-series-scatter.json',
    'option.commonChart-series-sunburst.json',
    'option.commonChart-series-treemap.json',
    'option.commonChart-series-waterfall.json',
    'option.commonChart-series-wordCloud.json'
  ],
  correlationChart: [
    'option.correlationChart-axes-band.json',
    'option.correlationChart-axes-linear.json',
    'option.correlationChart-legends-color.json',
    'option.correlationChart-legends-discrete.json',
    'option.correlationChart-legends-size.json'
  ],
  funnelChart: [
    'option.funnelChart-legends-color.json',
    'option.funnelChart-legends-discrete.json',
    'option.funnelChart-legends-size.json'
  ],
  gaugeChart: [
    'option.gaugeChart-axes-band.json',
    'option.gaugeChart-axes-linear.json',
    'option.gaugeChart-legends-color.json',
    'option.gaugeChart-legends-discrete.json',
    'option.gaugeChart-legends-size.json'
  ],
  heatmapChart: [
    'option.heatmapChart-axes-band.json',
    'option.heatmapChart-axes-linear.json',
    'option.heatmapChart-axes-log.json',
    'option.heatmapChart-axes-symlog.json',
    'option.heatmapChart-axes-time.json',
    'option.heatmapChart-legends-color.json',
    'option.heatmapChart-legends-discrete.json',
    'option.heatmapChart-legends-size.json'
  ],
  histogramChart: [
    'option.histogramChart-axes-linear.json',
    'option.histogramChart-axes-log.json',
    'option.histogramChart-axes-symlog.json',
    'option.histogramChart-axes-time.json',
    'option.histogramChart-legends-color.json',
    'option.histogramChart-legends-discrete.json',
    'option.histogramChart-legends-size.json'
  ],
  lineChart: [
    'option.lineChart-axes-band.json',
    'option.lineChart-axes-linear.json',
    'option.lineChart-axes-log.json',
    'option.lineChart-axes-symlog.json',
    'option.lineChart-axes-time.json',
    'option.lineChart-legends-color.json',
    'option.lineChart-legends-discrete.json',
    'option.lineChart-legends-size.json'
  ],
  linearProgressChart: [
    'option.linearProgressChart-axes-band.json',
    'option.linearProgressChart-axes-linear.json',
    'option.linearProgressChart-axes-log.json',
    'option.linearProgressChart-axes-symlog.json',
    'option.linearProgressChart-axes-time.json',
    'option.linearProgressChart-legends-color.json',
    'option.linearProgressChart-legends-discrete.json',
    'option.linearProgressChart-legends-size.json'
  ],
  liquidChart: [
    'option.liquidChart-legends-color.json',
    'option.liquidChart-legends-discrete.json',
    'option.liquidChart-legends-size.json'
  ],
  mapChart: [
    'option.mapChart-legends-color.json',
    'option.mapChart-legends-discrete.json',
    'option.mapChart-legends-size.json'
  ],
  pieChart: [
    'option.pieChart-axes-band.json',
    'option.pieChart-axes-linear.json',
    'option.pieChart-legends-color.json',
    'option.pieChart-legends-discrete.json',
    'option.pieChart-legends-size.json'
  ],
  radarChart: [
    'option.radarChart-axes-band.json',
    'option.radarChart-axes-linear.json',
    'option.radarChart-legends-color.json',
    'option.radarChart-legends-discrete.json',
    'option.radarChart-legends-size.json'
  ],
  rangeAreaChart: [
    'option.rangeAreaChart-axes-band.json',
    'option.rangeAreaChart-axes-linear.json',
    'option.rangeAreaChart-axes-log.json',
    'option.rangeAreaChart-axes-symlog.json',
    'option.rangeAreaChart-axes-time.json',
    'option.rangeAreaChart-legends-color.json',
    'option.rangeAreaChart-legends-discrete.json',
    'option.rangeAreaChart-legends-size.json'
  ],
  rangeColumnChart: [
    'option.rangeColumnChart-axes-band.json',
    'option.rangeColumnChart-axes-linear.json',
    'option.rangeColumnChart-axes-log.json',
    'option.rangeColumnChart-axes-symlog.json',
    'option.rangeColumnChart-axes-time.json',
    'option.rangeColumnChart-legends-color.json',
    'option.rangeColumnChart-legends-discrete.json',
    'option.rangeColumnChart-legends-size.json'
  ],
  roseChart: [
    'option.roseChart-axes-band.json',
    'option.roseChart-axes-linear.json',
    'option.roseChart-legends-color.json',
    'option.roseChart-legends-discrete.json',
    'option.roseChart-legends-size.json'
  ],
  sankeyChart: [
    'option.sankeyChart-axes-band.json',
    'option.sankeyChart-axes-linear.json',
    'option.sankeyChart-axes-log.json',
    'option.sankeyChart-axes-symlog.json',
    'option.sankeyChart-axes-time.json',
    'option.sankeyChart-legends-color.json',
    'option.sankeyChart-legends-discrete.json',
    'option.sankeyChart-legends-size.json'
  ],
  scatterChart: [
    'option.scatterChart-axes-band.json',
    'option.scatterChart-axes-linear.json',
    'option.scatterChart-axes-log.json',
    'option.scatterChart-axes-symlog.json',
    'option.scatterChart-axes-time.json',
    'option.scatterChart-legends-color.json',
    'option.scatterChart-legends-discrete.json',
    'option.scatterChart-legends-size.json'
  ],
  sequenceChart: [
    'option.sequenceChart-axes-linear.json',
    'option.sequenceChart-axes-log.json',
    'option.sequenceChart-axes-symlog.json',
    'option.sequenceChart-axes-time.json',
    'option.sequenceChart-legends-color.json',
    'option.sequenceChart-legends-discrete.json',
    'option.sequenceChart-legends-size.json',
    'option.sequenceChart-series-bar.json',
    'option.sequenceChart-series-dot.json',
    'option.sequenceChart-series-link.json'
  ],
  sunburstChart: [
    'option.sunburstChart-legends-color.json',
    'option.sunburstChart-legends-discrete.json',
    'option.sunburstChart-legends-size.json'
  ],
  treemapChart: [
    'option.treemapChart-legends-color.json',
    'option.treemapChart-legends-discrete.json',
    'option.treemapChart-legends-size.json'
  ],
  vennChart: [
    'option.vennChart-legends-color.json',
    'option.vennChart-legends-discrete.json',
    'option.vennChart-legends-size.json'
  ],
  waterfallChart: [
    'option.waterfallChart-total-custom.json',
    'option.waterfallChart-total-end.json',
    'option.waterfallChart-total-field.json'
  ]
};

export const knowledge = {
  data: '数据，数据源，图表的数据源，用于管理所有图表系列中用到的数据，vchart期望使用的是展平的数据',
  label: '标签，数据标签，图表标签，用于展示图形系列对应的原始数据信息',
  background:
    '背景，图表的背景，用于设置图表整体的背景样式，支持三种格式，包括：背景色、渐变色、图片，其中图片也支持html image标签、canvas元素等',
  totalLabel:
    '总计标签，一般用于堆积图表、百分比堆积图表中，用于展示总计标签，对于多系列的数据进行汇总计算，然后展示汇总信息',
  region: '图表区域，图表region，是一个矩形的区域；在直角坐标系中相当于x轴、y轴组成的区间；',
  axes: '轴，坐标轴，在直角坐标系下由x轴、y轴组成；在极坐标系下由角度轴和半径轴组成',
  legends:
    '图例，图表中的辅助标记，通过颜色、形状、大小来区分不同的数据分组，有助于更好地传达不同视觉编码的含义，也常用于图表中数据的筛选；在 VChart 中图例根据关联的数据类型的不同分为离散图例和连续图例，其中连续图例又分为颜色图例和尺寸图例',
  series:
    '系列，在数据可视化中，series（系列）是一个基本的概念，用于描述一组数据在图表中的呈现方式。一个 series 通常由一组或多组图元组成，比如线系列（lineSeries）通常由点和线组成，柱系列（barSeries）由矩形组成。在一个图表中可以包含多个 series，每个 series 基于自己的特性可以表示一份或多份数据。系列中的图元通过它们的属性与数据建立映射关系，来展示数据。比如位置，颜色，大小，形状，等等。举一个例子，比如气泡图会通过点的大小来表示数值的大小，使用颜色表示数据的分类',
  total: '总计配置，仅用于瀑布图，用于配置瀑布图中的总计数据和内容',
  tooltip:
    '信息提示窗，用以显示在图表不同系列图元上的对应的具体的数据信息，一般通过鼠标悬停等操作控制显示或者隐藏；有时候也被称为浮层组件、浮窗信息等',
  markLine: '辅助线，标记线，是数据标注的一种类型，通常用于标记图表中的特殊数据点，如平均值、最大值、最小值等',
  indicator:
    '指标卡，指标信息，用在饼图、玫瑰图以及雷达图等极坐标系下图表中的一种重要组件，它可以展示图表的重点数据信息，让图表更具有信息量和可读性',
  title: '标题，图表标题，用于负责展示图表的主题信息，由主标题和副标题组成',
  scrollBar: '滚动条，是一种交互组件，一般用于控制图表的滚动位置，以便用户可以在图表中查看更多的数据',
  crosshair:
    'crosshair，十字准星，游标，对应于echarts中的坐标轴指示器，是一种交互组件，一般用于展示图表中某个数据点的具体数值，以便用户可以更直观地了解数据的分布情况',
  markPoint: '辅助点，标注点，标记点，是数据标注的一种类型，通常用于标记图表中的特殊数据点，如最大值、最小值等',
  markArea: '辅助区域，标记区域，是数据标注的一种类型，通常用于标记图表中的特殊数据区域，如整体上涨区域、增长平稳期等',
  theme: '主题，用于控制一个应用中，所有图表的整体样式，一般区分深色模式、浅色模式，包含图表色板、图形样式等配置',
  customMark: '自定义图元，自定义mark，可以让用户在图表上添加自定义的标记，比如添加一些文本、图片、线段等',
  brush:
    '框选组件，刷选组件，主要由一个框选区域组成，框选后，框选区域内的数据会被选中，框选区域外的数据会被取消选中，常用于数据筛选、数据对比等场景',
  extensionMark: '扩展mark，系列扩展图元，系列扩展图形，用于在系列数据下，添加特定的图元以展示自定义的信息',
  player:
    '播放器，播放条，主要作用是增强动态叙事能力，支持播放、暂停播放、前进、后退等基本功能，帮助用户动态地展示序列数据。根据其支持的数据类型可以分为离散型和连续型两种播放类型',
  dataZoom:
    'datazoom，数据筛选滑块，数据缩放组件，数据过滤器，用于区域缩放，可以让用户更方便的缩放漫游图表数据，提高数据的可视性，同时增强图表的交互能力',
  direction:
    "图表的方向配置，仅对直角坐标系图表有空，其中'vertical'表示垂直布局，即常见的直角坐标系布局，x 轴位于底部，y 轴位于左侧。'horizontal'表示水平布局，可理解为 x 轴和 y 轴位置互换",
  padding:
    '内边距，图表的整体内边距，图表的内部留白配置，包括上下左右四个方向的内边距，一般用于控制图表的整体布局和美观度',
  seriesStyle: '各个系列样式，仅在图表配置了seriesField时生效，对每个系列设置不同的样式',
  hover:
    '图表中的系列图形hover交互，当设置为true或者配置不为空时，默认会在鼠标悬停、hover到系列图形时，给图形加上hover状态，用于实现交互效果',
  select:
    '图表中的系列图形选中交互，当设置为true或者配置不为空时，默认会在鼠标点击、选中系列图形时，给图形加上选中状态，用于实现交互效果',
  animationThreshold:
    '动画阈值，自动关闭动画的阀值，对应的是单系列data的长度，当系列数据小于这个阈值，才能使用动画，否则会自动关闭动画，防止图表卡顿',
  color: '色系配置，色盘配置，图表色系配置，图表公共的颜色视觉通道刻度设置，用于设置图表默认的颜色刻度',
  width: '宽度，图表宽度，图表的整体宽度，如果不设置默认会读取图表容器的宽度',
  height: '高度，图表高度，图表的整体高度，如果不设置默认会读取图表容器的高度 ',
  autoFit:
    '图表宽高是否自适应容器，浏览器环境下默认为 true。该配置的优先级高于构造函数中的 autoFit 配置。如果用户配置了 width，则以用户配置的 width 为准，height 同理。',
  layout: '图表布局，图表布局配置，整体布局配置，用于控制图表的布局方式，包括默认的占位布局以及网格grid布局，',
  scales:
    'scale，比例尺，比例尺配置，用于控制图表的比例尺，这里的scale是所有系列公用的比例尺，其中color是一个特殊的比例尺，用于控制图表的颜色比例尺',
  media: '媒体查询，媒体查询配置，用于控制图表在不同的设备上的显示效果，包括设备类型、屏幕尺寸、分辨率等'
};
