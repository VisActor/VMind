/**
 * transformer from https://github.com/blablahaha/concept-drift
 * Based on paper: Bifet and R. Gavalda. 2007. Learning from Time-Changing Data with Adaptive Windowing
 */
import { AdwinRowBucketList } from './bucket';

export class Adwin {
  /** Confidence value */
  delta: number;
  /** Max number of buckets within one bucket row */
  maxBuckets: number;
  /** Min number of new data for starting to reduce window and detect change */
  minClock: number;
  /** Min window length for starting to reduce window and detect change */
  minWinLen: number;
  /** Min sub-window length, which is split from whole window */
  minSubWinLen: number;

  /** Time is used for comparison with min_clock parameter */
  time: number;
  /** current window length */
  windowLen: number;
  /** sum of all values in window */
  windowSum: number;
  /** Variance of all values in the window  */
  windowVariance: number;

  /** Count of bucket row within window */
  bucketRowCount: number;
  /** bucket list */
  bucketRowList: AdwinRowBucketList;

  constructor(delta = 0.002, maxBuckets = 5, minClock = 32, minWinLen = 10, minSubWinLen = 5) {
    this.delta = delta;
    this.maxBuckets = maxBuckets;
    this.minClock = minClock;
    this.minWinLen = minWinLen;
    this.minSubWinLen = minSubWinLen;

    this.time = 0;
    this.windowLen = 0;
    this.windowSum = 0;
    this.windowVariance = 0;

    this.bucketRowCount = 0;
    this.bucketRowList = new AdwinRowBucketList(this.maxBuckets);
  }

  setInput(value: number) {
    this.time++;
    this.insertElement(value);
    return this.reduceWindow();
  }

  /**
   * Create a new bucket, and insert it into bucket row which is the head of bucket row list.
   * Meanwhile, this bucket row maybe compressed if reaches the maximum number of buckets.
   * @param value new stream data
   */
  private insertElement(value: number) {
    this.bucketRowList.head.insertBucket(value, 0);
    let incrementVariance = 0;
    if (this.windowLen > 0) {
      const mean = this.windowSum / this.windowLen;
      incrementVariance = (this.windowLen * (value - mean) ** 2) / (this.windowLen + 1);
    }
    this.windowLen++;
    this.windowVariance += incrementVariance;
    this.windowSum += value;

    this.compressBucketRow();
  }

  /** If reaches maximum number of buckets, then merge two buckets within one row into a next bucket row */
  private compressBucketRow() {
    let bucketRow = this.bucketRowList.head;
    let bucketRowLevel = 0;

    while (bucketRow !== null) {
      if (bucketRow.bucketCount === this.maxBuckets + 1) {
        let nextBucketRow = bucketRow.nextBucketRow;
        if (nextBucketRow === null) {
          this.bucketRowList.addToTail();
          nextBucketRow = bucketRow.nextBucketRow;
          this.bucketRowCount++;
        }
        const n1 = 2 ** bucketRowLevel;
        const n2 = 2 ** bucketRowLevel;

        const mean1 = bucketRow.bucketSum[0] / n1;
        const mean2 = bucketRow.bucketSum[1] / n2;
        const nextTotal = bucketRow.bucketSum[0] + bucketRow.bucketSum[1];
        const externalVariance = (n1 * n2 * (mean1 - mean2) ** 2) / (n1 + n2);
        const nextVariance = bucketRow.bucketVariance[0] + bucketRow.bucketVariance[1] + externalVariance;

        nextBucketRow.insertBucket(nextTotal, nextVariance);
        bucketRow.compressBucket(2);
        if (nextBucketRow.bucketCount <= this.maxBuckets) {
          break;
        }
      } else {
        break;
      }

      bucketRow = bucketRow.nextBucketRow;
      bucketRowLevel++;
    }
  }

  /**  Detect a change from last of each bucket row, reduce the window if there is a concept drift. */
  private reduceWindow() {
    let isChanged = false;
    if (this.time % this.minClock === 0 && this.windowLen >= this.minWinLen) {
      let isReducedWidth = true;
      while (isReducedWidth) {
        isReducedWidth = false;
        let isExit = false;
        let n0 = 0;
        let n1 = this.windowLen;
        let sum0 = 0;
        let sum1 = this.windowSum;

        let bucketRow = this.bucketRowList.tail;
        let i = this.bucketRowCount;
        while (!isExit && !bucketRow) {
          for (let bucketNum = 0; bucketNum < bucketRow.bucketCount; bucketNum++) {
            if (i === 0 && bucketNum === bucketRow.bucketCount - 1) {
              isExit = true;
              break;
            }

            n0 += 2 ** i;
            n1 -= 2 ** i;
            sum0 = bucketRow.bucketSum[bucketNum];
            sum1 -= bucketRow.bucketSum[bucketNum];
            const diffValue = sum0 / n0 - (sum1 - n1);

            if (n0 > this.minSubWinLen + 1 && n1 > this.minSubWinLen + 1) {
              if (this.reduceExpression(n0, n1, diffValue)) {
                isReducedWidth = true;
                isChanged = true;
                // eslint-disable-next-line max-depth
                if (this.windowLen > 0) {
                  n0 -= this.deleteElement();
                  isExit = true;
                  break;
                }
              }
            }
          }

          bucketRow = bucketRow.previousBucketRow;
          i--;
        }
      }
    }
    return isChanged;
  }

  private reduceExpression(n0: number, n1: number, diffValue: number) {
    const m = 1 / (n0 - this.minSubWinLen + 1) + 1 / (n1 - this.minSubWinLen + 1);
    const d = Math.log((2 * Math.log(this.windowLen)) / this.delta);
    const varianceWindow = this.windowVariance / this.windowLen;
    const epsilonCut = Math.sqrt(2 * m * varianceWindow * d) + (2 / 3) * m * d;
    return Math.abs(diffValue) > epsilonCut;
  }

  private deleteElement() {
    const bucketRow = this.bucketRowList.tail;
    const deletedNumber = 2 ** this.bucketRowCount;
    this.windowLen -= deletedNumber;
    this.windowSum -= bucketRow.bucketSum[0];

    const deletedBucketMean = bucketRow.bucketSum[0] / deletedNumber;
    const incVariance =
      bucketRow.bucketVariance[0] +
      (deletedNumber * this.windowLen * Math.pow(deletedBucketMean - this.windowSum / this.windowLen, 2)) /
        (deletedNumber + this.windowLen);

    this.windowVariance -= incVariance;

    bucketRow.compressBucket(1);
    if (bucketRow.bucketCount === 0) {
      this.bucketRowList.removeFromTail();
      this.bucketRowCount -= 1;
    }

    return deletedNumber;
  }
}
