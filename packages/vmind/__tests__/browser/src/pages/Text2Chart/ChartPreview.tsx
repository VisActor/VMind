import React, { useState, useEffect, useRef } from 'react';
import './index.scss';
import { Input, Card, Modal, Spin } from '@arco-design/web-react';
import VChart, { registerLiquidChart } from '@visactor/vchart';
import { isNil } from '@visactor/vutils';
import type { DataTable, FieldInfo } from '../../../../../src/index';
import { SimpleTable } from '../NewDataExtraction/DataTable';

type IPropsType = {
  commands: string[];
  specList: any[];
  style?: any;
  dataExtractionResult: {
    dataTable: DataTable;
    fieldInfo: FieldInfo[];
    textRange: string[];
  }[];
  dataCleanResult: {
    dataTable: DataTable;
    fieldInfo: FieldInfo[];
    textRange: string[];
  }[];
  costTime: number;
  loading: boolean;
  text: string;
  showTable: boolean;
};

registerLiquidChart();

export function ChartPreview(props: IPropsType) {
  const { specList, commands, loading, dataCleanResult, text, showTable = false } = props;
  const [textRange, setTextRange] = React.useState<[number, number]>([0, -1]);
  useEffect(() => {
    //defaultTicker.mode = 'raf';
    specList.forEach((spec: any, index: number) => {
      if (!spec) {
        return;
      }
      (document.getElementById(`chart-${index}`) as any).innerHTML = '';
      const cs = new VChart(spec, {
        dom: `chart-${index}`,
        mode: 'desktop-browser',
        dpr: 2,
        disableDirtyBounds: true
      });
      cs.renderAsync();
    });
  }, [specList]);

  return (
    <div className="right-chart" style={props.style}>
      <Spin style={{ flex: 1, display: 'flex', background: 'rgb(244, 244, 245)' }} loading={loading}>
        <div className="right-chart-content" style={{ display: 'flex' }}>
          <Card style={{ width: '45%', flexShrink: 0, marginRight: 12 }}>
            {text.split('').map((v, textIndex) => {
              return (
                <span
                  key={`${textIndex}-${v}`}
                  style={{
                    color: textIndex >= textRange[0] && textIndex <= textRange[1] ? '#ffa500' : 'rgba(0,0,0,0.7)'
                  }}
                >
                  {v}
                </span>
              );
            })}
          </Card>
          <div>
            {props.specList.map((spec: any, index: number) => {
              const currentTextRange = dataCleanResult?.[index]?.textRange;
              return (
                <Card
                  hoverable
                  style={{ flex: 1, background: 'rgb(244, 244, 245)', maxHeight: 400, marginBottom: 12 }}
                  key={index}
                >
                  <p>Command: {commands[index]}</p>
                  <div
                    style={{ display: 'flex' }}
                    onMouseEnter={() => {
                      if (textRange) {
                        setTextRange([
                          text.indexOf(currentTextRange[0]),
                          text.indexOf(currentTextRange[1]) + currentTextRange[1].length - 1
                        ]);
                      }
                    }}
                    onMouseLeave={() => {
                      setTextRange([0, -1]);
                    }}
                  >
                    {spec && (
                      <div
                        id={`chart-${index}`}
                        style={{ height: 250, width: 450, marginRight: 12, flexShrink: 0 }}
                        key={index}
                      ></div>
                    )}
                    {(showTable || !spec) && (
                      <div className="single-table">
                        <SimpleTable data={[dataCleanResult[index]]} />
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </Spin>
    </div>
  );
}
