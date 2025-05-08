/* eslint-disable no-console */
import * as canvas from 'canvas';
// 注意需要先编译
import VMind, { Model } from '../../src';
import * as specs from './spec';
import VChart, { registerLiquidChart, registerVennChart } from '@visactor/vchart';
import { get, isValid } from '@visactor/vutils';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 读取 .env.local 文件
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

let modelResultMap: any = {};

function generateResultHtml(models: string[]) {
  const mockModels = ['', ...models];
  const specNames = models.reduce((res, model) => {
    const { record } = modelResultMap[model];

    Object.keys(record).forEach(specName => {
      if (!res.includes(specName)) {
        res.push(specName);
      }
    });
    return res;
  }, []);

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <style>
        .result-row {
          display: flex;
          border-bottom: 1px solid #ccc;
        }
        .result-row p {
          margin: 0;
        }
        .model-column {
          flex: 1;
          border-right: 1px solid #ccc;
        }
        .model-column:last-child {
          border-right: none;
        }   
      </style>
    </head>
    <body>
      <h1>测试结果</h1>

      <div class="result-row">
      ${mockModels
        .map((model, index) => {
          return `
            <div class="model-column">
              <h2 class="model-title">${model}</h2>
            </div>
          `;
        })
        .join('')}
      </div>

      <div class="result-row">
      ${mockModels
        .map((model, index) => {
          if (model && modelResultMap[model]) {
            const { totalCount, successCount, errorCount, score } = modelResultMap[model];

            return `
             <div class="model-column model-summary">
                <p>总数量: ${totalCount}</p>
                <p>成功数量: ${successCount}</p>
                <p>失败数量: ${errorCount}</p>
                <p>成功率: ${((successCount / totalCount) * 100).toFixed(2)}%</p>
                <p>平均分: ${score.toFixed(2)}</p>
              </div>
            `;
          }

          return `<div class="model-column model-summary">整体数据</div>`;
        })
        .join('')}
      </div>


      ${specNames
        .map(specName => {
          const listContent = mockModels.map(model => {
            if (model && modelResultMap[model]) {
              const record = modelResultMap[model].record[specName];

              if (record) {
                const { score, diffPaths, hasImage } = record || {};
                const scoreStr = isValid(score) ? `<p>分数: ${score.toFixed(2)}</p>` : '';
                const diffPathStr = diffPaths && diffPaths.length ? `<p>差异路径: ${diffPaths.join(', ')}</p>` : '';
                const imageStr = hasImage ? `<image src="./images/${specName}_${model}.png" />` : '';

                return `<div class="model-column model-score">
              ${scoreStr}
              ${diffPathStr}
              ${imageStr}
              </div>`;
              }

              return `<div class="model-column model-score">本次运行出错了</div>`;
            }

            return `<div class="model-column model-score">
            <p class="spec-name">${specName}</p> 
            <image src="./images/${specName}.png" />
          </div>`;
          });

          return `
            <div class="result-row">
              ${listContent.join('')}
            </div>
          `;
        })
        .join('')}
    </body>
    </html>
  `;
  fs.writeFileSync(path.join(__dirname, './output', `${models.join('_VS_')}.html`), html);
}

function createImage(
  spec: any,
  options: { width?: number; height?: number; saveImageDir?: string; saveName?: string; needBase64?: boolean } = {}
) {
  spec.width = options.width ?? 400;
  spec.height = options.height ?? 300;

  try {
    if (spec.type === 'liquid') {
      registerLiquidChart();
    } else if (spec.type === 'venn') {
      registerVennChart();
    }

    const vchart = new VChart(spec, {
      mode: 'node',
      modeParams: canvas,
      dpr: 1,
      animation: false
    });

    vchart.renderSync();

    const buffer = vchart.getImageBuffer();

    const dir = path.join(__dirname, options.saveImageDir ?? './output');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFileSync(path.join(dir, `${options.saveName}.png`), buffer);
    if (options.needBase64 !== false) {
      return `data:image/png;base64,${fs.readFileSync(path.join(dir, `${options.saveName}.png`)).toString('base64')}`;
    }
    return true;
  } catch (err) {
    console.log(`[error] - ${options.saveName})`, spec);
    console.log(err);
  }

  return undefined;
}

function compareSpec(spec: any, specByLLM: any, checkPaths: string[] = []) {
  if (!specByLLM || specByLLM.type !== spec.type) {
    return { score: 0 };
  }
  const totalScore = checkPaths.length + 1;
  let score = 1;
  const diffPaths: string[] = [];
  checkPaths.forEach(path => {
    if (get(spec, path) === get(specByLLM, path)) {
      score += 1;
    } else {
      diffPaths.push(path);
    }
  });

  return {
    score: score / totalScore,
    diffPaths
  };
}

const testImage = async (vmind: any) => {
  const model = vmind.llm.options.model;
  console.log(`===== model ${model}  ======`);
  if (!modelResultMap[model]) {
    modelResultMap[model] = { totalCount: 0, successCount: 0, errorCount: 0, record: {}, score: 0 };
  }
  let modelScore = 0;

  // 将每个案例的处理改为串行执行
  for (const specName of Object.keys(specs)) {
    const { spec, ckeckPaths } = (specs as any)[specName];

    console.log(`[start] - ${specName}`);
    const imagePath = path.join(__dirname, './output/images', `${specName}.png`);
    let imageBase64;

    // 检查图片是否已存在
    if (fs.existsSync(imagePath)) {
      imageBase64 = `data:image/png;base64,${fs.readFileSync(imagePath).toString('base64')}`;
    } else {
      imageBase64 = createImage(spec, {
        saveImageDir: './output/images',
        saveName: `${specName}`
      });
    }

    try {
      const { spec: specByLLM, error } = await vmind.generateChart('', null, null, {
        image: imageBase64
      });

      if (error) {
        modelResultMap[model].errorCount += 1;
      } else {
        modelResultMap[model].record[specName] = {
          score: 0,
          specByLLM,
          simpleVChartSpec: vmind.data2ChartSchedule.context?.simpleVChartSpec
        };
        const llmImageBase64 = createImage(specByLLM, {
          needBase64: false,
          saveImageDir: './output/images',
          saveName: `${specName}_${model}`
        });

        const { score, diffPaths } = compareSpec(spec, specByLLM, ckeckPaths);

        modelResultMap[model].successCount += 1;
        modelScore += score * (llmImageBase64 ? 1 : 0); // 如果没有生成图片，不计入分数
        modelResultMap[model].record[specName].score = score;
        modelResultMap[model].record[specName].diffPaths = diffPaths;
        modelResultMap[model].record[specName].hasImage = !!llmImageBase64;
      }
    } catch (err) {
      console.log(`[error] - ${specName}`, err, vmind.data2ChartSchedule.context?.simpleVChartSpec);

      modelResultMap[model].errorCount += 1;
    } finally {
      console.log(`[end] - ${specName}`);
      modelResultMap[model].totalCount += 1;
    }
  }

  modelResultMap[model].score = modelScore / modelResultMap[model].totalCount;

  const dir = path.join(__dirname, './output');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFileSync(path.join(__dirname, './output', `${model}.json`), JSON.stringify(modelResultMap[model], null, 2));
};

const getGptVMind = (model: string, showThoughts = false) => {
  const gptKey = process.env.VITE_GPT_KEY;
  const gptURL = process.env.VITE_GPT_JEST_URL;

  if (gptKey && gptURL) {
    const vmind = new VMind({
      url: gptURL,
      model,
      showThoughts: showThoughts,
      headers: {
        'api-key': gptKey
      }
    });
    return vmind;
  }

  return null;
};

const getArkModel = (model: string, showThoughts = false) => {
  const arkKey = process.env.VITE_ARK_KEY;
  const arkURL = process.env.VITE_ARK_JEST_URL;
  if (arkKey && arkURL) {
    const vmind = new VMind({
      url: arkURL,
      model,
      showThoughts: showThoughts,
      headers: {
        Authorization: `Bearer ${arkKey}`
      }
    });
    return vmind;
  }
  return null;
};

const run = async (onlyUpdateHtml?: boolean) => {
  const models = [Model.GPT_4o, 'ep-20250422120422-zd89f'];
  const jsonFile = path.join(__dirname, './output', `${models.join('_VS_')}.json`);

  if (onlyUpdateHtml) {
    modelResultMap = JSON.parse(fs.readFileSync(jsonFile, { encoding: 'utf-8' }));
    generateResultHtml(models);
  } else {
    await testImage(getGptVMind(Model.GPT_4o));
    await testImage(getArkModel('ep-20250422120422-zd89f'));
    fs.writeFileSync(jsonFile, JSON.stringify(modelResultMap, null, 2));

    generateResultHtml(models);
  }
};

run(true);

function getDelta(compareType: string) {
  switch (compareType) {
    case '-1d':
      return 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
}

function formatData(
  data: { region: string; data: number; timestampSource: number; compare: string }[],
  hasMoreThanOneDay: boolean
) {
  return data.map(entry => {
    const baseTimestamp = entry.timestampSource - getDelta(entry.compare);
    const date = new Date(baseTimestamp);

    return {
      ...entry,
      baseTimeString: hasMoreThanOneDay
        ? `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
        : ``
    };
  });
}
