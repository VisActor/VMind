const canvas = require('canvas');
// 注意需要先编译
const VMindAll = require('../../cjs/index');

const { default: VMind, Model } = VMindAll;
const specs = require('./spec');
const VChart = require('@visactor/vchart');
const { get } = require('@visactor/vutils');
const fs = require('fs');
const path = require('path');

const dotenv = require('dotenv');

// 读取 .env.local 文件
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const modelResultMap = {};

function generateResultHtml() {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <style>
        .model-column {
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
        }
        .model-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .model-summary {
          display: flex;
          flex-direction: column;
          margin-bottom: 10px;
        }
        .model-detail {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .model-detail li {
          margin-bottom: 10px;
        }
       .model-detail li p {
          margin-bottom: 5px;
        }
       .model-detail li div {
          display: flex;
          flex-direction: row;
        }
       .model-detail li div image {
         
          width: 200px;
          height: 200px;
          margin-right: 10px;
        }
       .model-detail li p {
          margin-bottom: 5px;
        }
       .model-detail li div {
          display: flex;
          flex-direction: row;
        }
       .model-detail li div image {
          width: 200px;
          height: 200px;
          margin-right: 10px;
        }
       .model-detail li div image:last-child {
          margin-right: 0;
        }
       .model-detail li div image {
          width: 200px;
          height: 200px;
          margin-right: 10px;
        } 
       }
      </style>
    </head>
    <body>
      <h1>测试结果</h1>
      ${Object.keys(modelResultMap).map(model => {
        const { totalCount, successCount, errorCount, record, score } = modelResultMap[model];
        return `
          <div class="model-column">
            <h2 class="model-title">${model}</h2>
            <div class="model-summary">
              <p>总数量: ${totalCount}</p>
              <p>成功数量: ${successCount}</p>
              <p>失败数量: ${errorCount}</p>
              <p>成功率: ${((successCount / totalCount) * 100).toFixed(2)}%</p>
              <p>平均分: ${score.toFixed(2)}</p>
            </div>
            <ul class="model-detail">
              ${Object.keys(record)
                .map(specName => {
                  const { score, diffPaths } = record[specName];
                  const diffPathStr = diffPaths && diffPaths.length ? `<p>差异路径: ${diffPaths.join(', ')}</p>` : '';
                  return `
                  <li>
                    <p>${specName}</p>
                    <p>分数: ${score.toFixed(2)}</p>
                    ${diffPathStr}
                    <div>
                      <image src="../images/${specName}.png" />
                      <image src="../images/${specName}_byLLM.png" />
                    </div>
                  </li>
                `;
                })
                .join('')}
            </ul>
          </div>
        `;
      })}
    </body>
    </html>
  `;
  fs.writeFileSync(path.join(__dirname, './output', 'result.html'), html);
}

function createImage(spec, options = {}) {
  spec.width = options.width ?? 400;
  spec.height = options.height ?? 300;

  try {
    if (spec.type === 'liquid') {
      VChart.registerLiquidChart();
    } else if (spec.type === 'venn') {
      VChart.registerVennChart();
    }

    const vchart = new VChart.default(spec, {
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

function compareSpec(spec, specByLLM, checkPaths = []) {
  if (!specByLLM || specByLLM.type !== spec.type) {
    return { score: 0 };
  }
  const totalScore = checkPaths.length + 1;
  let score = 1;
  const diffPaths = [];
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

const testImage = async vmind => {
  const model = vmind.llm.options.model;
  if (!modelResultMap[model]) {
    modelResultMap[model] = { totalCount: 0, successCount: 0, errorCount: 0, record: {}, score: 0 };
  }
  let modelScore = 0;

  // 将每个案例的处理改为串行执行
  for (const specName of Object.keys(specs)) {
    const { spec, ckeckPaths } = specs[specName];

    console.log(`[start] - ${specName}`);
    const imageBase64 = createImage(spec, {
      saveImageDir: 'images',
      saveName: `${specName}`
    });

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
          saveImageDir: 'images',
          saveName: `${specName}_byLLM`
        });

        const { score, diffPaths } = compareSpec(spec, specByLLM, ckeckPaths);

        modelResultMap[model].successCount += 1;
        modelScore += score * (llmImageBase64 ? 1 : 0); // 如果没有生成图片，不计入分数
        modelResultMap[model].record[specName].score = score;
        modelResultMap[model].record[specName].diffPaths = diffPaths;
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
  generateResultHtml();
};

const getGptVMind = (model, showThoughts = false) => {
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

testImage(getGptVMind(Model.GPT_4o));
