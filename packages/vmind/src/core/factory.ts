import type { BaseAtomConstructor, BaseContext, BaseOptions } from '../types/atom';
import { BaseAtom } from '../atom/base';

export class Factory {
  private static atoms: Record<string, any> = {};

  static registerAtom(name: string, Ctr: BaseAtomConstructor<any, any>) {
    this.atoms[name] = Ctr;
  }

  static getAtom(name: string) {
    return this.atoms[name];
  }

  static createAtom(name: string, context: Partial<BaseContext>, options: Partial<BaseOptions>) {
    const Ctr = this.getAtom(name);

    if (Ctr) {
      return new Ctr(context, options);
    }

    return new BaseAtom(context, options);
  }
}
