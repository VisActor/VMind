/* eslint-disable max-len */
export const VMIND_DATA_SOURCE = 'VMind_data_source';

export const getInsightTextPrompt = (context?: string) => `# 任务
用户使用一些洞察提取算法，从数据中发现了一些数据洞察。用户想在图表中使用标注的形式将这些洞察展现出来。请你根据用户输入的json格式的洞察信息，生成能够展示在图表标注中的文本。

# 说明
type: 洞察类型
data: 出现洞察的数据项
value: 洞察的具体值
seriesName: 出现洞察的类别名称
${context && context.length > 0 ? '#背景\n' + context + '\n' : '\n'}
# 要求
1. 生成的文本要尽可能简短，但不能遗漏数据中关键的维度和指标信息，用户需要了解洞察的完整内容
2. 生成的文本要有较高的可读性`;
