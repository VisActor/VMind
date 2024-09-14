import { IconBgColors, IconBulb, IconLanguage } from '@arco-design/web-react/icon';
import React from 'react';
import { DataExtractionTask } from './DataExtraction/test';
import { DataExtractionResult } from './DataExtraction/caseStudy';
type MenuInfo = {
  menuItem: string;
  subItems: {
    key: string;
    name: string;
    component: any;
  }[];
  icon: any;
  slogan?: string;
};

export enum PLAYGROUND_PAGES {
  CHART_GENERATION = 'chart_generation',
  SMART_INSIGHT = 'smart-insight',
  DATA_EXTRACTION = 'data-extraction'
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
  }
};
export const CollapseCSS = {
  width: '100vw',
  height: '100vh',
  border: '1px solid var(--color-border)',
  background: 'var(--color-fill-2)',
  overflow: 'hidden'
};
