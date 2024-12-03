/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React from 'react';
import { Button, Input, InputNumber } from '@arco-design/web-react';
import './color.scss';
import axios from 'axios';
import { uniqArray } from '@visactor/vutils';
const TextArea = Input.TextArea;

const defaultPalette: string[] = uniqArray([
  '#FEF0F0',
  '#FEE3E2',
  '#FDC6C4',
  '#E22E28',
  '#E22E28',
  '#FFF3E5',
  '#FEE7CD',
  '#FEC48B',
  '#C25705',
  '#853A05',
  '#FBF4DF',
  '#FAEDC2',
  '#FCDF7E',
  '#AD7A03',
  '#6F4A01',
  '#F2F8D3',
  '#E3F0A3',
  '#C8DD5F',
  '#6B7F06',
  '#4A5804',
  '#E4FAE1',
  '#D0F5CE',
  '#D0F5CE',
  '#258832',
  '#0B6017',
  '#E2F8F5',
  '#C4F2EC',
  '#6FE8D8',
  '#0F8575',
  '#045D51',
  '#E7F8FE',
  '#CAEFFC',
  '#97DCFC',
  '#047FB0',
  '#0F587A',
  '#F0F4FF',
  '#E0E9FF',
  '#C2D4FF',
  '#336DF4',
  '#0442D2',
  '#FEF0F8',
  '#FEE2F2',
  '#F8C4E1',
  '#CC398C',
  '#9D1562',
  '#F5F0FE',
  '#EFE6FE',
  '#DCC9FD',
  '#8D55ED',
  '#611FD6',
  '#F5F6F7',
  '#F2F3F5',
  '#EFF0F1',
  '#646A73',
  '#373C43'
]) as string[];

const host = 'https://workspace-ws369f043bbc54c11c-http-3000.ide.byted.org/';
// const host = 'http://172.16.71.160:3000/';
async function getColorPalette(
  colorPalette: string[],
  K: number,
  recommendType: 'sum' | 'adjacent' | 'exhaustive',
  harmony: number,
  discriminability: number,
  requiredColor?: string[]
) {
  const res = await axios(`${host}getRecommendColorPalette`, {
    method: 'POST',
    headers: {
      // 'api-key': 'MEMEECtjIL16DL8pgw7TcVAg0LIELcQwqiyHa5SjrKQduN5uVGb+uewUz4U9oxdnHI4q/vhyS/0bav391Ivkgque9AQA'
      'api-key': 'MEIEDMYAB65nQJb23zJVwgQgiK0Qn6nRu4UwCgdzqn7zS93Anv9llBzYHm6L2uUGiKUEED2UogsrYftHJxTAndVBLuM='
    },
    data: {
      colorPalette,
      K,
      recommendType,
      harmonyWeight: harmony,
      discriminabilityWeight: discriminability,
      requiredColor
    }
  }).then(res => res.data);
  return res;
}

export function ColorPalette() {
  const [sumRes, setSumRes] = React.useState([[]]);
  const [exhaustive, setExhaustive] = React.useState([[]]);
  const [adjacent, setAdjacent] = React.useState([[]]);
  const [kList, setKList] = React.useState([3, 4, 5]);
  const [harmony, setHarmony] = React.useState(0.7);
  const [requiredColor, setRequiredColor] = React.useState<string[]>(['#FDC6C4', '#0F8575']);
  const [discriminability, setDiscriminability] = React.useState(1);

  const handleClick = React.useCallback(async () => {
    const res1 = await Promise.all(
      kList.map(v => getColorPalette(defaultPalette, v, 'sum', harmony, discriminability, requiredColor))
    );
    const res2 = await Promise.all(
      kList.map(v => getColorPalette(defaultPalette, v, 'adjacent', harmony, discriminability, requiredColor))
    );
    setSumRes(res1.map(v => v.colorPalette));
    setAdjacent(res2.map(v => v.colorPalette));
    console.log(res1, res2);
  }, [discriminability, harmony, kList, requiredColor]);

  const getExhaustive = React.useCallback(async () => {
    const res = await Promise.all(
      kList.map(v => getColorPalette(defaultPalette, v, 'exhaustive', harmony, discriminability, requiredColor))
    );
    setExhaustive(res.map(v => v.colorPalette));
    console.log(res);
  }, [discriminability, harmony, kList, requiredColor]);

  return (
    <div style={{ padding: 20, paddingTop: 0 }}>
      <h3>当前总色板:</h3>
      <div className="color-bar">
        {defaultPalette.map(v => (
          <div key={v} className="color-cell" style={{ background: v }} />
        ))}
      </div>
      <h3>设置必选色（type：string[], 必须是#aabbcc格式)</h3>
      <TextArea
        placeholder="Input Your Query"
        defaultValue={`[${requiredColor.join(',')}]`}
        onChange={v => {
          const list = v.replace('[', '').replace(']', '').split(',');
          setRequiredColor(list.map(v => v.trim()));
        }}
        style={{ minHeight: 60, margin: 12, marginLeft: 0, background: 'transparent', border: '1px solid #eee' }}
      />
      <div className="color-bar">
        {requiredColor.length
          ? requiredColor.map(v => <div key={v} className="color-cell" style={{ background: v }} />)
          : null}
      </div>
      <h3>设置系数</h3>
      <InputNumber
        min={0}
        max={1}
        defaultValue={harmony}
        step={0.01}
        precision={1}
        prefix={'和谐度系数'}
        onChange={v => {
          setHarmony(v);
        }}
        style={{ width: 160, margin: '10px 24px 10px 0' }}
      />
      <InputNumber
        min={0}
        max={1}
        defaultValue={discriminability}
        step={0.01}
        precision={1}
        prefix={'差异性系数'}
        onChange={v => {
          setDiscriminability(v);
        }}
        style={{ width: 160, margin: '10px 24px 10px 0' }}
      />
      <h3>生成个数(可以输入一个数组，看多个结果)</h3>
      <TextArea
        placeholder="Input Your Query"
        defaultValue={`[${kList.join(',')}]`}
        onChange={v => {
          const list = v.replace('[', '').replace(']', '').split(',');
          setKList(list.map(v => +v));
        }}
        style={{ minHeight: 60, margin: 12, marginLeft: 0, background: 'transparent', border: '1px solid #eee' }}
      />
      <div>
        <Button onClick={handleClick} style={{ fontWeight: 'bold', color: 'black' }}>
          获取结果
        </Button>
      </div>
      <div>
        <div className="color-content">
          <div>
            <h4>By Sum</h4>
            <div className="color-cotent">
              {sumRes.map((list, index) => (
                <div className="color-bar" key={kList[index]}>
                  {list.map((v, index) => (
                    <div key={`${v}-${index}`} className="color-cell" style={{ background: v }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4>By Adjacent</h4>
            <div className="color-cotent">
              {adjacent.map((list, index) => (
                <div className="color-bar" key={kList[index]}>
                  {list.map((v, index) => (
                    <div key={`${v}-${index}`} className="color-cell" style={{ background: v }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ marginTop: 12 }}>
              <Button onClick={getExhaustive} style={{ fontWeight: 'bold', color: 'black' }}>
                获取穷举结果(相当耗时，不建议k {'>'} 6)
              </Button>
            </div>
            <h4>穷举结果</h4>
            <div className="color-cotent">
              {exhaustive.map((list, index) => (
                <div className="color-bar" key={kList[index]}>
                  {list.map((v, index) => (
                    <div key={`${v}-${index}`} className="color-cell" style={{ background: v }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
