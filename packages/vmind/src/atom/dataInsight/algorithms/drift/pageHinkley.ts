/** Page Hinkely algorithm, @todo remove trend influence */
export class PageHinkley {
  delta: number;
  lambda: number;
  alpha: number;
  threshold: number;
  sum: number;
  minSum: number;
  useMin: boolean;
  xMean: number;
  num: number;
  changeDetected: boolean;

  constructor(delta = 0.005, lambda = 0.55, alpha = 0.92, threshold = 0.25, useMin = false) {
    this.delta = delta;
    this.lambda = lambda;
    this.alpha = alpha;
    this.threshold = threshold;
    this.sum = 0;
    this.xMean = 0;
    this.num = 0;
    this.minSum = 0;
    this.useMin = useMin;
    this.changeDetected = false;
  }

  _resetParams() {
    this.num = 0;
    this.xMean = 0;
    this.sum = 0;
    this.minSum = 0;
  }

  setInput(x: number) {
    this._detectDrift(x);
    return this.changeDetected;
  }

  _detectDrift(x: number) {
    if (isNaN(x)) {
      return;
    }
    this.num += 1;
    this.xMean = (x + this.xMean * (this.num - 1)) / this.num;
    this.sum = this.sum * this.alpha + (x - this.xMean);
    if (this.sum > 0) {
      this.sum -= this.delta;
    } else {
      this.sum += this.delta;
    }
    if (this.sum < this.minSum) {
      this.minSum = this.sum;
    }

    this.changeDetected = (this.useMin ? this.sum - this.minSum : Math.abs(this.sum)) > this.lambda;
    if (this.changeDetected) {
      this._resetParams();
      this.changeDetected = Math.abs(x - this.xMean) >= this.threshold;
    }
  }
}
