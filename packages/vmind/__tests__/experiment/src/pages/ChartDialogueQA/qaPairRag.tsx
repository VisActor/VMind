/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React from 'react';
import { RAGManage } from '../../../../../src/index';
import { Button, Input, Card } from '@arco-design/web-react';
import { isString } from '@visactor/vutils';
import './rag.scss';
const TextArea = Input.TextArea;

const globalVariables = (import.meta as any).env;
const qaRag = new RAGManage({
  url: 'http://localhost:3333/api/viking_db/',
  headers: {
    region: globalVariables.VITE_VIKING_DB_REGION,
    token: globalVariables.VITE_VIKING_DB_TOKEN
  },
  vikingdbName: globalVariables.VITE_VIKING_DB_NAME
});
const docsRag = new RAGManage({
  url: 'http://localhost:3333/api/viking_db/',
  headers: {
    region: globalVariables.VITE_VIKING_DB_REGION,
    token: globalVariables.VITE_VIKING_DB_DOCS_TOKEN
  },
  vikingdbName: globalVariables.VITE_VIKING_DB_DOCS_NAME
});

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

export function QARag() {
  const [query, setQuery] = React.useState('');
  const [topK, setTopK] = React.useState(3);
  const [qaResult, setQAResult] = React.useState<
    {
      scores: number;
      question: string;
      answer: string;
      explanation: string;
    }[]
  >([]);
  const [docsResult, setDocsResult] = React.useState<
    {
      scores: number;
      index: string;
      text: string;
      key: string;
      validKey: string;
    }[]
  >([]);
  const [docsCompResult, setDocsCompResult] = React.useState<
    {
      scores: number;
      index: string;
      text: string;
      key: string;
      validKey: string;
    }[]
  >([]);

  const getQaResult = React.useCallback(async () => {
    return await qaRag.rawRecall({
      indexName: 'betaV1',
      topK,
      text: query
    });
  }, [query, topK]);

  const getDocsResult = React.useCallback(async () => {
    return await docsRag.rawRecall({
      indexName: 'betaV1',
      topK,
      text: query,
      manualChunk: true,
      dslQuery: {
        filter: {
          op: 'must',
          field: 'type',
          conds: ['barChart']
        }
      }
    });
  }, [query, topK]);

  const getDocsCompResult = React.useCallback(async () => {
    return await docsRag.rawRecall({
      indexName: 'betaV1',
      topK,
      text: query,
      manualChunk: true,
      dslQuery: {
        filter: {
          op: 'must',
          field: 'file_name',
          conds: chartFileMapping.barChart
        }
      }
    });
  }, [query, topK]);

  const handleQuery = React.useCallback(async () => {
    const [qaResult, docsResult, docCompResult] = await Promise.all([
      getQaResult(),
      getDocsResult(),
      getDocsCompResult()
    ]);
    if (!qaResult?.error) {
      setQAResult(
        (qaResult?.result ?? []).map(item => {
          const attrs = isString(item.attrs) ? JSON.parse(item.attrs) : item.attrs;
          const { answer, content, keyList } = attrs;
          const jsonContent = JSON.parse(content);
          return {
            scores: item.scores,
            question: jsonContent.question,
            explanation: jsonContent.explanation,
            answer
          };
        })
      );
    } else {
      setQAResult([]);
    }
    if (!docsResult?.error) {
      setDocsResult(
        (docsResult?.result ?? []).map(item => {
          const attrs = isString(item.attrs) ? JSON.parse(item.attrs) : item.attrs;
          const { key, content, validKey, index } = attrs;
          return {
            scores: item.scores,
            index: index,
            text: content,
            key,
            validKey
          };
        })
      );
    } else {
      setDocsResult([]);
    }
    if (!docCompResult?.error) {
      setDocsCompResult(
        (docCompResult?.result ?? []).map(item => {
          const attrs = isString(item.attrs) ? JSON.parse(item.attrs) : item.attrs;
          const { key, content, validKey, index } = attrs;
          return {
            scores: item.scores,
            index: index,
            text: content,
            key,
            validKey
          };
        })
      );
    } else {
      setDocsCompResult([]);
    }
  }, [getDocsCompResult, getDocsResult, getQaResult]);

  return (
    <div style={{ padding: 20, paddingTop: 0 }}>
      <TextArea
        placeholder="Input Your Query"
        value={query}
        onChange={v => setQuery(v)}
        style={{ minHeight: 60, margin: 12, marginLeft: 0, background: 'transparent', border: '1px solid #eee' }}
      />
      <Button onClick={handleQuery} shape="round" type="primary" size="large">
        Get Rag Result
      </Button>
      <div>
        <div className="recall-content">
          <div className="one-content">
            <div>QA Recall:</div>
            {qaResult.map((item, index) => (
              <Card key={index} className="qa-card">
                <div className="qa-div">
                  <span className="title">Score:</span>
                  <span>{item.scores.toFixed(2)}</span>
                </div>
                <div className="qa-div">
                  <div className="title">Question:</div>
                  <span>{item.question}</span>
                </div>
                <div className="qa-div">
                  <div className="title">Explanation:</div>
                  <span>{item.explanation}</span>
                </div>
                <div className="qa-div">
                  <div className="title">Answer:</div>
                  <span>{item.answer}</span>
                </div>
              </Card>
            ))}
          </div>
          <div className="one-content">
            <div>Docs Recall:</div>
            {docsResult.map((item, index) => (
              <Card key={index} className="qa-card">
                <div className="qa-div">
                  <span className="title">Score:</span>
                  <span>{item.scores.toFixed(2)}</span>
                </div>
                <div className="qa-div">
                  <div className="title">content:</div>
                  <span>{item.text}</span>
                </div>
                <div className="qa-div">
                  <div className="title">key:</div>
                  <span>{item.key}</span>
                </div>
                <div className="qa-div">
                  <div className="title">validKey:</div>
                  <span>{item.validKey}</span>
                </div>
              </Card>
            ))}
          </div>
          <div className="one-content">
            <div>Docs Comp Recall:</div>
            {docsCompResult.map((item, index) => (
              <Card key={index} className="qa-card">
                <div className="qa-div">
                  <span className="title">Score:</span>
                  <span>{item.scores.toFixed(2)}</span>
                </div>
                <div className="qa-div">
                  <div className="title">content:</div>
                  <span>{item.text}</span>
                </div>
                <div className="qa-div">
                  <div className="title">key:</div>
                  <span>{item.key}</span>
                </div>
                <div className="qa-div">
                  <div className="title">validKey:</div>
                  <span>{item.validKey}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
