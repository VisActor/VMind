import { AtomName, type DataExtractionCtx } from '../../types/atom';
import type { BaseOptions, DataExtractionOptions } from '../type';
import { BaseAtom } from '../base';
import { merge, pick } from '@visactor/vutils';
import type { LLMMessage } from '../../types/llm';
import { getBasePrompt, getFieldInfoPrompt } from './prompt/prompt';
import { getLanguageOfText } from '../../utils/text';
import { formatFieldInfo, hasMeasureField } from '../../utils/field';
import { getCtxBymeasureAutoTransfer } from '../dataClean/utils';
import type { DatasetFromText, FieldInfo } from '../../types';
import { DataType } from '../../types';

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

  buildDefaultOptions(): DataExtractionOptions {
    return {
      reGenerateFieldInfo: true,
      isCapcut: false
    };
  }

  shouldRunByContextUpdate(context: DataExtractionCtx): boolean {
    return context.text !== this.context.text || context.fieldInfo !== this.context.fieldInfo;
  }

  getLLMMessages(query?: string): LLMMessage[] {
    const { fieldInfo, text } = this.context;
    const { showThoughts, reGenerateFieldInfo, llm, isCapcut } = this.options;
    const addtionContent = this.getHistoryLLMMessages(query);
    const language = this.options?.language ?? getLanguageOfText(text);
    if (!fieldInfo || !fieldInfo?.length) {
      return [
        {
          role: 'system',
          content: getBasePrompt(llm.options.model, language, isCapcut, showThoughts)
        },
        {
          role: 'user',
          // content: `${language === 'english' ? 'Extracted text is bellow:' : '提取文本如下：'}${text}`
          content: `text: ${text}`
        },
        ...addtionContent
      ];
    }
    const fieldInfoContent = fieldInfo.map(info => pick(info, ['fieldName', 'dataExample', 'type', 'description']));
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

  revisedFieldInfo(fieldInfo: any[]): FieldInfo[] {
    return fieldInfo.map(info => {
      const { fieldName, type, isRatio, isDate, unit, ratioGranularity } = info;
      let finalType = type === 'dimension' ? DataType.STRING : DataType.NUMERICAL;
      if (isRatio) {
        finalType = DataType.RATIO;
      } else if (isDate) {
        finalType = DataType.DATE;
      }
      return {
        fieldName,
        unit,
        ratioGranularity,
        type: finalType,
        role: type
      };
    });
  }

  private parseMultipleResult(dataset: DatasetFromText[]) {
    return dataset
      .map(result => {
        return {
          ...result,
          fieldInfo: formatFieldInfo(this.revisedFieldInfo(result.fieldInfo))
        };
      })
      .filter(result => hasMeasureField(result.fieldInfo));
  }

  parseLLMContent(resJson: any) {
    const { isCapcut } = this.options;
    const { dataTable, fieldInfo, isDataExtraction, dataset } = resJson;
    if (isDataExtraction === false || (isCapcut && !dataset)) {
      console.error("It's not a data extraction task");
      return this.context;
    }
    if (isCapcut) {
      return {
        ...this.context,
        datasets: this.parseMultipleResult(dataset)
      };
    }
    const llmFieldInfo = this.revisedFieldInfo(fieldInfo);
    return {
      ...this.context,
      fieldInfo: formatFieldInfo(
        (this.options?.reGenerateFieldInfo ? llmFieldInfo : null) ?? this.context?.fieldInfo ?? []
      ),
      dataTable
    } as DataExtractionCtx;
  }

  protected _runWithOutLLM(): DataExtractionCtx {
    return getCtxBymeasureAutoTransfer(this.context, this.context.text) as DataExtractionCtx;
  }
}
