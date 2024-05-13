import { IconBgColors, IconBulb } from '@arco-design/web-react/icon';
import { ChartGenerationPage } from './ChartGeneration/ChartGeneration';
import React from 'react';
import { InsightPage } from './Insight/Insight';
type MenuInfo = {
  menuItem: string;
  pageName: string;
  component: any;
  icon: any;
  slogan?: string;
};

export enum PLAYGROUND_PAGES {
  CHART_GENERATION = 'chart_generation',
  SMART_INSIGHT = 'smart-insight'
}

export const PLAYGROUND_MENU_INFO: {
  [key: string]: MenuInfo;
} = {
  [PLAYGROUND_PAGES.CHART_GENERATION]: {
    menuItem: 'Chart Generation',
    pageName: 'Chart Generation',
    component: <ChartGenerationPage />,
    icon: <IconBgColors />
  },
  [PLAYGROUND_PAGES.SMART_INSIGHT]: {
    menuItem: 'Smart Insight',
    pageName: 'Smart Insight',
    component: <InsightPage />,
    icon: <IconBulb />
  }
};
export const CollapseCSS = {
  width: '100vw',
  height: '100vh',
  border: '1px solid var(--color-border)',
  background: 'var(--color-fill-2)'
};
