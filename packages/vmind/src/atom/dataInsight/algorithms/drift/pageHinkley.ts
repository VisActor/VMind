export class PageHinkley {
  delta: number;
  lambda: number;
  alpha: number;
  sum: number;
  xMean: number;
  num: number;
  changeDetected: boolean;

  constructor(delta = 0.005, lambda = 50, alpha = 1 - 0.0001) {
    this.delta = delta;
    this.lambda = lambda;
    this.alpha = alpha;
    this.sum = 0;
    this.xMean = 0;
    this.num = 0;
    this.changeDetected = false;
  }

  _resetParams() {
    this.num = 0;
    this.xMean = 0;
    this.sum = 0;
  }

  setInput(x: number) {
    this._detectDrift(x);
    return this.changeDetected;
  }

  _detectDrift(x: number) {
    this.num += 1;
    this.xMean = (x + this.xMean * (this.num - 1)) / this.num;
    this.sum = this.sum * this.alpha + (x - this.xMean - this.delta);

    this.changeDetected = this.sum > this.lambda;
    if (this.changeDetected) {
      this._resetParams();
    }
  }
}
