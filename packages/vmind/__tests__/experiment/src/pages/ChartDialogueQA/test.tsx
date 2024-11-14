/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React from 'react';
import { Model } from '../../../../../src/index';
import { LLMManage } from '../../../../../src/index';
import { Button } from '@arco-design/web-react';
import { getCurrentFormattedTime, sleep } from '../../utils';
import { data } from '../../data/qaData';
import { ChartQAExtraction } from '../../../../../src/atom';

const globalVariables = (import.meta as any).env;
const llm = new LLMManage({
  url: globalVariables.VITE_GPT_URL,
  headers: {
    'api-key': globalVariables.VITE_GPT_KEY,
    Authorization: `Bearer ${globalVariables.VITE_GPT_KEY}`
  },
  maxTokens: 2048,
  model: Model.GPT_4o
});
const qaExtraction = new ChartQAExtraction({} as any, { llm });

function extractSpecAndSolution(markdownText: string) {
  // 提取问题标题
  const regex = /title:\s*\d+\.\s*(.+?)<\/br>/;
  let title = '';
  const titleMatch = markdownText.match(regex);
  if (titleMatch) {
    title = titleMatch[1];
  } else {
    const newTitleMatch = markdownText.match(/^# (.+)$/m);
    title = newTitleMatch ? newTitleMatch[1] : '';
  }

  // 提取代码块中的 JSON 对象
  const codeBlockRegex = /```(?:javascript livedemo)?\n([\s\S]*?)```/g;
  const codeExampleSectionRegex = /## 代码示例\s*([\s\S]*?)(?=\n## |$)/;
  const sectionMatch = markdownText.match(codeExampleSectionRegex);
  let specJson = null;
  let match;
  if (sectionMatch && sectionMatch[1]) {
    const codeExampleText = sectionMatch[1].trim();
    while ((match = codeBlockRegex.exec(codeExampleText)) !== null) {
      const codeContent = match[1];
      const specMatch = codeContent.match(/const spec\s*=\s*({[\s\S]*?});/);
      if (specMatch) {
        specJson = specMatch[1];
        break;
      }
    }
  }

  // 提取解决方案中的文本和代码
  const solutionRegex = /## 解决方案([\s\S]*?)(##|$)/;
  const solutionMatch = markdownText.match(solutionRegex);
  let solutionContent = '';
  if (solutionMatch) {
    solutionContent = solutionMatch[1].trim();
  }

  // 提取问题描述中的文本
  const descriptionRegex = /## 问题描述([\s\S]*?)(##|$)/;
  const descriptionMatch = markdownText.match(descriptionRegex);
  let descriptionContent = '';
  if (descriptionMatch) {
    descriptionContent = descriptionMatch[1].trim();
  }
  return { title, specJson, descriptionContent, solutionContent };
}

export function ChartQAGenerator() {
  const handleRun = React.useCallback(async () => {
    console.info('---------Run Chart QA Extraction Task!---------');

    const result: any = [];
    for (let i = 0; i < data.length; i++) {
      if (![98].includes(i)) {
        continue;
      }
      const { content, fileName } = data[i];
      const revisedContent = content
        .replace(/^# 问题描述(\s*)$/gm, '## 问题描述')
        .replace(/^# 解决方案(\s*)$/gm, '## 解决方案')
        .replace(/^# 代码示例(\s*)$/gm, '## 代码示例')
        .replace(/^# \*\*问题描述\*\*(\s*)$/gm, '## 问题描述')
        .replace(/^# \*\*解决方案\*\*(\s*)$/gm, '## 解决方案')
        .replace(/^# \*\*代码示例\*\*(\s*)$/gm, '## 代码示例');
      const { title, specJson, descriptionContent, solutionContent } = extractSpecAndSolution(revisedContent);
      const text = JSON.stringify({
        title: title || fileName,
        description: descriptionContent,
        fullDSL: specJson,
        answer: solutionContent
      });
      console.info(`Extraction_${i + 1}. ${title}`);
      qaExtraction.reset({
        text,
        answer: '',
        question: title ?? '',
        keyList: [],
        explanation: ''
      });
      await qaExtraction.run();
      const { answer, keyList, explanation } = qaExtraction.getContext();
      result.push({
        question: title || fileName,
        answer,
        keyList,
        explanation
      });
      console.info(result);
      await sleep(5000);
    }
    console.info(`---------Finish ALL---------`);
    // 将 JSON 对象转换为字符串
    const jsonString = JSON.stringify(result, null, 2);

    // 创建一个 Blob 对象
    const blob = new Blob([jsonString], { type: 'application/json' });

    // 创建一个 URL 对象
    const url = URL.createObjectURL(blob);

    // 创建一个 a 标签并设置相关属性
    const a = document.createElement('a');
    a.href = url;
    a.download = `chart_qa_extraction_${getCurrentFormattedTime()}.json`;

    // 将 a 标签添加到 DOM 并触发点击事件
    document.body.appendChild(a);
    a.click();

    // 移除 a 标签
    document.body.removeChild(a);

    // 释放 URL 对象
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Button onClick={handleRun} shape="round" type="primary" size="large">
        Run Test!
      </Button>
    </div>
  );
}

const a = [
  { file_name: 'option.areaChart-axes-band.json', component_type: 'axes-band' },
  { file_name: 'option.areaChart-axes-linear.json', component_type: 'axes-linear' },
  { file_name: 'option.areaChart-axes-log.json', component_type: 'axes-log' },
  { file_name: 'option.areaChart-axes-symlog.json', component_type: 'axes-symlog' },
  { file_name: 'option.areaChart-axes-time.json', component_type: 'axes-time' },
  { file_name: 'option.areaChart-legends-color.json', component_type: 'legends-color' },
  { file_name: 'option.areaChart-legends-discrete.json', component_type: 'legends-discrete' },
  { file_name: 'option.areaChart-legends-size.json', component_type: 'legends-size' },
  { file_name: 'option.commonChart-series-area.json', component_type: 'series-area' },
  { file_name: 'option.commonChart-series-bar.json', component_type: 'series-bar' },
  { file_name: 'option.commonChart-series-boxPlot.json', component_type: 'series-boxPlot' },
  { file_name: 'option.commonChart-series-circlePacking.json', component_type: 'series-circlePacking' },
  { file_name: 'option.commonChart-series-dot.json', component_type: 'series-dot' },
  { file_name: 'option.commonChart-series-funnel.json', component_type: 'series-funnel' },
  { file_name: 'option.commonChart-series-heatmap.json', component_type: 'series-heatmap' },
  { file_name: 'option.commonChart-series-line.json', component_type: 'series-line' },
  { file_name: 'option.commonChart-series-linearProgress.json', component_type: 'series-linearProgress' },
  { file_name: 'option.commonChart-series-link.json', component_type: 'series-link' },
  { file_name: 'option.commonChart-series-map.json', component_type: 'series-map' },
  { file_name: 'option.commonChart-series-radar.json', component_type: 'series-radar' },
  { file_name: 'option.commonChart-series-rangeArea.json', component_type: 'series-rangeArea' },
  { file_name: 'option.commonChart-series-rangeColumn.json', component_type: 'series-rangeColumn' },
  { file_name: 'option.commonChart-series-rose.json', component_type: 'series-rose' },
  { file_name: 'option.commonChart-series-sankey.json', component_type: 'series-sankey' },
  { file_name: 'option.commonChart-series-scatter.json', component_type: 'series-scatter' },
  { file_name: 'option.commonChart-series-sunburst.json', component_type: 'series-sunburst' },
  { file_name: 'option.commonChart-series-treemap.json', component_type: 'series-treemap' },
  { file_name: 'option.commonChart-series-waterfall.json', component_type: 'series-waterfall' },
  { file_name: 'option.commonChart-series-wordCloud.json', component_type: 'series-wordCloud' },
  { file_name: 'option.waterfallChart-total-custom.json', component_type: 'total-custom' },
  { file_name: 'option.waterfallChart-total-end.json', component_type: 'total-end' },
  { file_name: 'option.waterfallChart-total-field.json', component_type: 'total-field' }
];
