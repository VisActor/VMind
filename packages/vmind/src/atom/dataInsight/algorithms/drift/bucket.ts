class AdwinBucketRow {
  maxBuckets: number;

  bucketCount: number;

  nextBucketRow: AdwinBucketRow | null;

  previousBucketRow: AdwinBucketRow | null;

  bucketSum: number[];

  bucketVariance: number[];

  constructor(maxBuckets = 5, nextBucketRow: AdwinBucketRow = null, previousBucketRow: AdwinBucketRow = null) {
    this.maxBuckets = maxBuckets;
    this.bucketCount = 0;
    this.nextBucketRow = nextBucketRow;
    this.previousBucketRow = previousBucketRow;

    if (nextBucketRow !== null) {
      nextBucketRow.previousBucketRow = this;
    }

    if (previousBucketRow !== null) {
      previousBucketRow.nextBucketRow = this;
    }

    this.bucketSum = new Array(this.maxBuckets + 1).fill(0);
    this.bucketVariance = new Array(this.maxBuckets + 1).fill(0);
  }

  insertBucket(value: number, variance: number) {
    this.bucketSum[this.bucketCount] = value;
    this.bucketVariance[this.bucketCount] = variance;
    this.bucketCount += 1;
  }

  compressBucket(numberDeleted: number) {
    const deleteIndex = this.maxBuckets - numberDeleted + 1;
    for (let i = 0; i < deleteIndex; i++) {
      this.bucketSum[i] = this.bucketSum[i + numberDeleted];
      this.bucketVariance[i] = this.bucketVariance[i + numberDeleted];
    }
    for (let i = deleteIndex; i < this.maxBuckets + 1; i++) {
      this.bucketSum[i] = 0;
      this.bucketVariance[i] = 0;
    }
    this.bucketCount -= numberDeleted;
  }
}

export class AdwinRowBucketList {
  maxBuckets: number;

  count: number;

  head: AdwinBucketRow | null;

  tail: AdwinBucketRow | null;

  constructor(maxBuckets = 5) {
    this.maxBuckets = maxBuckets;
    this.count = 0;
    this.head = null;
    this.tail = null;
    this._addToHead();
  }

  _addToHead() {
    this.head = new AdwinBucketRow(this.maxBuckets, this.head);
    if (this.tail === null) {
      this.tail = this.head;
    }
    this.count += 1;
  }

  addToTail() {
    this.tail = new AdwinBucketRow(this.maxBuckets, null, this.tail);
    if (this.head === null) {
      this.head = this.tail;
    }
    this.count += 1;
  }

  removeFromTail() {
    if (this.tail !== null) {
      this.tail = this.tail.previousBucketRow;
      if (this.tail === null) {
        this.head = null;
      } else {
        this.tail.nextBucketRow = null;
      }
      this.count -= 1;
    }
  }
}
