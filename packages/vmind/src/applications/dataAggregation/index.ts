import { BaseApplication } from 'src/base/application';
import { SQL } from './types';
import { DataItem } from 'src/typings';

export class DataAggregationApplication extends BaseApplication<{}, DataItem> {}
