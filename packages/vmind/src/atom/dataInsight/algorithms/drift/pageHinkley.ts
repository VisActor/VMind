/** Page Hinkely algorithm, @todo remove trend influence */
export class PageHinkley {
  delta: number;
  lambda: number;
  alpha: number;
  threshold: number;
  sum: number;
  minSum: number;
  xMean: number;
  num: number;
  changeDetected: boolean;

  constructor(delta = 0.006, lambda = 0.6, alpha = 0.95, threshold = 0.3) {
    this.delta = delta;
    this.lambda = lambda;
    this.alpha = alpha;
    this.threshold = threshold;
    this.sum = 0;
    this.xMean = 0;
    this.num = 0;
    this.minSum = 0;
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
    this.num += 1;
    this.xMean = (x + this.xMean * (this.num - 1)) / this.num;
    this.sum = this.sum * this.alpha + (x - this.xMean - this.delta);
    if (this.sum < this.minSum) {
      this.minSum = this.sum;
    }

    this.changeDetected = this.sum - this.minSum > this.lambda;
    if (this.changeDetected) {
      this._resetParams();
      this.changeDetected = x - this.xMean >= this.threshold;
    }
  }
}
