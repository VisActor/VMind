import { AtomName, type DataExtractionCtx } from '../../types/atom';
import type { BaseOptions, DataExtractionOptions } from '../type';
import { BaseAtom } from '../base';
import { merge, pick } from '@visactor/vutils';
import type { LLMMessage } from '../../types/llm';
import { getBasePrompt, getFieldInfoPrompt } from './prompt';
import { getLanguageOfText } from '../../utils/text';
import { formatFieldInfo } from '../../utils/field';

export class DataExtractionAtom extends BaseAtom<DataExtractionCtx, DataExtractionOptions> {
  name = AtomName.DATA_EXTRACT;

  isLLMAtom = true;

  constructor(context: DataExtractionCtx, option: BaseOptions) {
    super(context, option);
  }

  buildDefaultContext(context: DataExtractionCtx): DataExtractionCtx {
    return merge(
      {},
      {
        dataTable: [],
        fieldInfo: []
      },
      context
    );
  }

  shouldRunByContextUpdate(context: DataExtractionCtx): boolean {
    return context.text !== this.context.text || context.fieldInfo !== this.context.fieldInfo;
  }

  getLLMMessages(query?: string): LLMMessage[] {
    const { fieldInfo, text } = this.context;
    const { showThoughts, reGenerateFieldInfo } = this.options;
    const addtionContent = this.getHistoryLLMMessages(query);
    const language = getLanguageOfText(text);
    if (!fieldInfo || !fieldInfo?.length) {
      return [
        {
          role: 'system',
          content: getBasePrompt(language, showThoughts)
        },
        {
          role: 'user',
          content: `${language === 'english' ? 'Extracted text is bellow:' : '提取文本如下：'}${text}`
        },
        ...addtionContent
      ];
    }
    const fieldInfoContent = fieldInfo.map(info =>
      pick(info, ['fieldName', 'dataExample', 'fieldType', 'description'])
    );
    const fieldInfoString = JSON.stringify(fieldInfoContent);
    const userContent = `User's fieldInfo is bellow:
\`\`\` TypeScript
${fieldInfoString}
\`\`\`
${language === 'english' ? 'Extracted text is bellow:' : '提取文本如下：'}${text}
`;
    return [
      {
        role: 'system',
        content: getFieldInfoPrompt(language, showThoughts, reGenerateFieldInfo)
      },
      {
        role: 'user',
        content: userContent
      },
      ...addtionContent
    ];
  }

  parseLLMContent(resJson: any) {
    const { dataTable, fieldInfo, isDataExtraction } = resJson;
    if (!isDataExtraction) {
      console.error("It's not a data extraction task");
      return this.context;
    }
    return {
      ...this.context,
      fieldInfo: formatFieldInfo(
        (this.options?.reGenerateFieldInfo ? fieldInfo : null) ?? this.context?.fieldInfo ?? []
      ),
      dataTable
    } as DataExtractionCtx;
  }
}
