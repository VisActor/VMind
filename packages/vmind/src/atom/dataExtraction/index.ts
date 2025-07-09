import { AtomName, type DataExtractionCtx, type DataExtractionOptions, type BaseOptions } from '../../types/atom';
import { BaseAtom } from '../base';
import { merge, pick } from '@visactor/vutils';
import type { LLMMessage } from '../../types/llm';
import { getBasePrompt, getFieldInfoPrompt, getUserQuery } from './prompt/prompt';
import { getLanguageOfText } from '../../utils/text';
import { formatFieldInfo, getRoleByFieldType, hasMeasureField } from '../../utils/field';
import { getCtxBymeasureAutoTransfer } from '../dataClean/utils';
import type { DatasetFromText } from '../../types';
import { Factory } from '../../core/factory';
import type { BaseAtomConstructor } from '../../types';
import type { DataTable, FieldInfoItem } from '@visactor/generate-vchart';
import { DataType, getFieldInfoFromDataset } from '@visactor/generate-vchart';

export class DataExtractionAtom extends BaseAtom<DataExtractionCtx, DataExtractionOptions> {
  name = AtomName.DATA_EXTRACT;

  isLLMAtom = true;

  replaceData: {
    template: string;
    replace: string;
  }[];

  isTextReplaceStatus: boolean[];

  constructor(context: DataExtractionCtx, option: BaseOptions) {
    super(context, option);
    const currentYear = new Date().getFullYear();
    this.replaceData = [
      {
        template: '今年',
        replace: `${currentYear}年`
      },
      {
        template: '去年',
        replace: `${currentYear - 1}年`
      },
      {
        template: '前年',
        replace: `${currentYear - 2}年`
      }
    ];
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
      ...super.buildDefaultOptions(),
      reGenerateFieldInfo: true,
      isMultiple: false
    };
  }

  shouldRunByContextUpdate(context: DataExtractionCtx): boolean {
    return context.text !== this.context.text || context.fieldInfo !== this.context.fieldInfo;
  }

  revisedText(text: string) {
    let newText = text;
    this.isTextReplaceStatus = [];
    this.replaceData.forEach(v => {
      newText = newText.replaceAll(v.template, v.replace);
      this.isTextReplaceStatus.push(text.includes(v.template));
    });
    return `text: ${newText}`;
  }

  getLLMMessages(query?: string): LLMMessage[] {
    const { fieldInfo, text } = this.context;
    const { showThoughts, reGenerateFieldInfo, llm, isMultiple } = this.options;
    const addtionContent = this.getHistoryLLMMessages(query);
    const language = this.options?.language ?? getLanguageOfText(text);
    if (!fieldInfo || !fieldInfo?.length) {
      return [
        {
          role: 'system',
          content: getBasePrompt(llm.options.model, language, isMultiple, showThoughts)
        },
        {
          role: 'user',
          content: this.revisedText(text)
        },
        ...getUserQuery(llm.options.model, language, isMultiple),
        ...addtionContent
      ];
    }
    const fieldInfoContent = (fieldInfo as any[]).map(info =>
      pick(info, ['fieldName', 'dataExample', 'type', 'description'])
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

  revisedFieldInfo(dataTable: DataTable, fieldInfo: any[]): FieldInfoItem[] {
    const fieldInfoByData = getFieldInfoFromDataset(dataTable);
    const fieldMapping: Record<string, FieldInfoItem> = fieldInfoByData.reduce(
      (prev, curV) => ({
        ...prev,
        [curV.fieldName]: curV
      }),
      {}
    );
    return fieldInfo.map(info => {
      const { fieldName, type, isRatio, unit } = info;
      const mapInfo = fieldMapping?.[fieldName];
      let finalType: string = type === 'dimension' ? DataType.STRING : DataType.NUMERICAL;
      if (isRatio) {
        finalType = DataType.RATIO;
      } else {
        finalType = mapInfo?.type ?? finalType;
      }
      return {
        fieldName,
        unit,
        ratioGranularity: isRatio ? unit : null,
        type: finalType,
        role: getRoleByFieldType(finalType)
      };
    });
  }

  parseSubText(text: string, textRange: [string, string]) {
    const [start, end] = textRange ?? [];
    if (!start || !end || !text) {
      return text;
    }
    const pattern = new RegExp(start + '(.*?)' + end, 'gs');
    let match;

    // 使用正则表达式搜索匹配
    if ((match = pattern.exec(text)) !== null) {
      return `${start}${match[1]}${end}`;
    }
    return text;
  }

  private parseMultipleResult(dataset: DatasetFromText[]) {
    return dataset
      .map(result => {
        return {
          ...result,
          text: this.parseSubText(this.context.text, result.textRange),
          fieldInfo: formatFieldInfo(this.revisedFieldInfo(result.dataTable, result.fieldInfo))
        };
      })
      .filter(result => hasMeasureField(result.fieldInfo));
  }

  parseLLMContent(resJson: any) {
    const { isMultiple } = this.options;
    const { dataTable, fieldInfo, isDataExtraction, dataset, thoughts } = resJson;
    if (isDataExtraction === false || (isMultiple && !dataset)) {
      console.error("It's not a data extraction task");
      return this.context;
    }
    if (isMultiple) {
      return {
        ...this.context,
        thoughts,
        datasets: this.parseMultipleResult(dataset)
      };
    }
    const llmFieldInfo = this.revisedFieldInfo(dataTable, fieldInfo);
    return {
      ...this.context,
      thoughts,
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

export const registerDataExtractionAtom = () => {
  Factory.registerAtom(
    AtomName.DATA_EXTRACT,
    DataExtractionAtom as unknown as BaseAtomConstructor<DataExtractionCtx, DataExtractionOptions>
  );
};
