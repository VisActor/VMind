import type { BaseApplication } from 'src/base/application';

export type VMindApplicationMap = {
  [name: string]: {
    [modelType: string]: BaseApplication<any, any>;
  };
};
