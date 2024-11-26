/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React from 'react';
import { Model } from '../../../../../src/index';
import { LLMManage } from '../../../../../src/index';
import { Button } from '@arco-design/web-react';
import { getCurrentFormattedTime, sleep } from '../../utils';
import { data } from '../../data/qaData';
import { ChartQAExtraction, CustomPrompt } from '../../../../../src/atom';

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

const customAtom = new CustomPrompt({} as any, {
  llm,
  promptTemplate: `# Background
You are a data visualization expert with an in-depth understanding of graphic grammar and visualization chart libraries such as d3, echarts, and ggplot2. And you know how to use simple and straightforward language to help users understand visualization content.
Now I have a new visualization frontend library called VChart. I have extracted all the type definitions and descriptions from the VChart documentation. Your task is to generate a new type description for this key based on the user's input of the type key and type description

# Requirement
1. Generate a one-sentence description based on user input.
2. Directly describe its effect or purpose so that beginners can understand it instantly.
3. The influence of the parentKey MUST be considered. For example, styling a target differs when setting styles for value labels compared to axis labels.
4. The string content of the answer will be directly parsed using JSON.parse function, so ensure the accuracy of the format.
5. Answer must be Chinese

# User Input
\`\`\`
{
"key": string; // current key to generate description
"desc": string; // current description
"parentKeyList"?: { // The current keyPath is deeply nested, and this is the relevant description of the parent key.
"key": string,
"desc": string,
}[],
}
\`\`\`
# Examples
Input:
\`\`\`
{"key": 'barChart.background",
"desc": "<p>图表背景色配置，优先级高于构造函数中的 background 配置。</p>\n<p>支持三种格式：</p>\n<ul>\n<li>颜色字符串</li>\n<li>渐变色（自 1.11.6 版本开始支持）</li>\n<li>图片配置</li>\n</ul>\n<p><strong>渐变色使用如下：</strong></p>\n<p>渐变色配置。可以在图元样式的 <code class=\"codespan\">fill</code> 和 <code class=\"codespan\">stroke</code> 等支持配置颜色的属性上配置渐变色，目前支持三种渐变配置：</p>\n<ul>\n<li>线性渐变</li>\n</ul>\n\n<ul>\n<li>径向渐变</li>\n</ul>\n\n<ul>\n<li>锥形渐变</li>\n</ul>\n\n<p><strong>图片配置结构如下：</strong></p>\n<p>使用示例:</p>\n"
\`\`\`
Output:
\`\`\`
{"desc": "背景色设置"}
\`\`\``
});
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
  const codeBlockRegex = /\`\`\`(?:javascript livedemo)?\n([\s\S]*?)\`\`\`/g;
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

  const handleRunOne = React.useCallback(async () => {
    console.info('---------Run Chart QA Extraction Task!---------');
    for (let i = 0; i < 10; i++) {
      console.info(
        '!!!',
        await customAtom.run({
          query: JSON.stringify({
            key: 'padding.left',
            desc:
              `<p>左边距配置。</p>\n<p>支持直接配置数值（单位 px）、百分比（<code class=\"codespan\">%</code>）(图表视窗尺寸的百分比) 以及回调配置。回调函数定义如下：</p>\n\n<p>使用示例:</p>\n<ul>\n<li>数值：<code class=\"codespan\">45</code> 为像素值 px</li>\n<li>百分比：<code class=\"codespan\">'10%'</code> 当在水平方向时是<strong>图表视图区域</strong> <code class=\"codespan\">宽度</code> 的百分比，当在垂直方向时是<strong>图表视图区域</strong> <code class=\"codespan\">高度</code> 的百分比</li>\n<li>回调：<code class=\"codespan\">({ width, height }) =&gt; width * 0.5</code> 返回值被当做像素值 px</li>\n</ul>\n` +
              (Math.random() * 100).toFixed(2)
          })
        })
      );
    }
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Button onClick={handleRun} shape="round" type="primary" size="large">
        Run Test!
      </Button>
      <Button onClick={handleRunOne} shape="round" type="primary" size="large">
        Generate One Setence test
      </Button>
    </div>
  );
}
