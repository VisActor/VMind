import { IconBgColors, IconBulb, IconLanguage } from '@arco-design/web-react/icon';
import React from 'react';
import { DataExtractionTask } from './DataExtraction/test';
import { DataExtractionResult } from './DataExtraction/caseStudy';
import { ChartGenerationTask } from './ChartGenerator/test';
import { ChartGeneratorResult } from './ChartGenerator/caseStudy';
import { ChartQAGenerator } from './ChartDialogueQA/test';
import { QARag } from './ChartDialogueQA/qaPairRag';
import { ColorPalette } from './ChartDialogueQA/tempColor';
type MenuInfo = {
  menuItem: string;
  subItems: {
    key: string;
    name: string;
    component: any;
  }[];
  icon?: any;
  slogan?: string;
};

export enum PLAYGROUND_PAGES {
  CHART_GENERATION = 'chart-generation',
  SMART_INSIGHT = 'smart-insight',
  DATA_EXTRACTION = 'data-extraction',
  CHART_DIALOG_QA = 'chart-dialog-qa'
}

export const PLAYGROUND_MENU_INFO: {
  [key: string]: MenuInfo;
} = {
  [PLAYGROUND_PAGES.DATA_EXTRACTION]: {
    menuItem: 'Data Extraction',
    icon: <IconLanguage />,
    subItems: [
      {
        key: '0',
        name: 'Run Case',
        component: <DataExtractionTask />
      },
      {
        key: '1',
        name: 'Case Study',
        component: <DataExtractionResult />
      }
    ]
  },
  [PLAYGROUND_PAGES.CHART_GENERATION]: {
    menuItem: 'Chart Generation',
    icon: <IconBgColors />,
    subItems: [
      {
        key: '0',
        name: 'Run Case',
        component: <ChartGenerationTask />
      },
      {
        key: '1',
        name: 'Case Study',
        component: <ChartGeneratorResult />
      }
    ]
  },
  [PLAYGROUND_PAGES.CHART_DIALOG_QA]: {
    menuItem: 'Chart Dialogue QA',
    subItems: [
      {
        key: '0',
        name: 'Run Case',
        component: <ChartQAGenerator />
      },
      {
        key: '1',
        name: 'QA Rag',
        component: <QARag />
      },
      {
        key: '2',
        name: 'Color Palette Test',
        component: <ColorPalette />
      }
    ]
  }
};
export const CollapseCSS = {
  width: '100vw',
  height: '100vh',
  border: '1px solid var(--color-border)',
  background: 'var(--color-fill-2)',
  overflow: 'hidden'
};
