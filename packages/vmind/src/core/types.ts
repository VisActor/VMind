import type { BaseApplication } from '../base/application';

export type VMindApplicationMap = {
  [name: string]: {
    [modelType: string]: BaseApplication<any, any>;
  };
};
