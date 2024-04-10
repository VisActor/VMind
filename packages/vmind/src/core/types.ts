import { BaseApplication } from 'src/base/application';
import { ApplicationType } from './applications';

export type VMindApplicationMap = {
  [name: string]: {
    [modelType: string]: BaseApplication<any, any>;
  };
};
