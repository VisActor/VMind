import { AtomName } from '../../types/atom';
import type { BaseOptions } from '../../types';
import { BaseAtom } from '../base';
import type { LLMMessage } from '../../types/llm';
import { getSystemPrompt } from './prompt';
import type { ImageReaderCtx } from './interface';
import { Factory } from '../../core/factory';
import type { BaseAtomConstructor } from '../../types';

export class ImageReader extends BaseAtom<ImageReaderCtx, BaseOptions> {
  name = AtomName.IMAGE_READER;

  isLLMAtom = true;

  constructor(context: ImageReaderCtx, option: BaseOptions) {
    super(context, option);
  }

  getLLMMessages(query?: string): LLMMessage[] {
    const { image } = this.context;
    return [
      {
        role: 'system',
        content: getSystemPrompt()
      },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: image
            }
          },
          {
            type: 'text',
            text:
              'Please read this image and generate a JSON based on the chart information in the image ' +
              'that can be used to recreate the chart.'
          }
        ]
      }
    ];
  }

  parseLLMContent(resJson: any): ImageReaderCtx {
    if (!resJson) {
      return {
        ...this.context,
        error: 'Image is Empty'
      };
    }
    return {
      ...this.context,
      simpleVChartSpec: resJson
    };
  }
}

export const registerImageReaderAtom = () => {
  Factory.registerAtom(
    AtomName.IMAGE_READER,
    ImageReader as unknown as BaseAtomConstructor<ImageReaderCtx, BaseOptions>
  );
};
