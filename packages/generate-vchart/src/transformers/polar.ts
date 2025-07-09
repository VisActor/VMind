import { GenerateChartInput } from '../types/transform';
import { DEFAULT_PIE_VIDEO_LENGTH } from '../utils/constants';
import { onlyUnique } from './common';

export const animationPie = (context: GenerateChartInput) => {
  const { spec, animationOptions } = context;

  const totalTime = animationOptions?.totalTime ?? DEFAULT_PIE_VIDEO_LENGTH;
  const groupKey = context.cell.color as string;
  const dataValues = spec.data.values as any[];
  const groupNum = dataValues.map(d => d[groupKey!]).filter(onlyUnique).length;
  //const delay = totalTime / groupNum - 1000;
  const loopTime = 100 + groupNum * 100 + 400;
  // 看看是否可以500ms走一个循环
  if (groupNum * 500 + loopTime < totalTime) {
    // 前面500ms的oneByone
    spec.animationAppear = {
      oneByOne: Number.MIN_VALUE,
      duration: (totalTime - loopTime) / groupNum,
      options: {
        overall: false
      }
    };
    // 然后走循环动画
    spec.animationNormal = {
      pie: [
        {
          startTime: 100,
          oneByOne: 100,
          timeSlices: [
            {
              delay: 0,
              effects: {
                channel: {
                  scaleX: { to: 1.2 },
                  scaleY: { to: 1.2 }
                },
                easing: 'linear'
              },
              duration: 200
            },
            {
              effects: {
                channel: {
                  scaleX: { to: 1 },
                  scaleY: { to: 1 }
                },

                easing: 'linear'
              },
              duration: 200
            }
          ]
        }
      ]
    };
  } else {
    spec.animationAppear = {
      oneByOne: Number.MIN_VALUE,
      duration: totalTime / groupNum,
      options: {
        overall: false
      }
    };
  }
  return { spec };
};
