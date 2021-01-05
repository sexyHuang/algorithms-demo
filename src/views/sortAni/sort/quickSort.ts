import sleep from '/src/utils/sleep';

const quickSort = (input: number[], delay = 0) => {
  const sort = async (start = 0, end = input.length) => {
    let middleIdx = Math.floor((start + end) / 2);
    const middleValue = input[middleIdx];
    const swag = async (i: number, j: number) => {
      await sleep(delay);
      [input[i], input[j]] = [input[j], input[i]];
      console.log(i, j);
    };
    let left = start,
      right = end - 1;
    if (right <= left) return;
    while (left < right) {
      while (input[left] <= middleValue && left < middleIdx) {
        left++;
      }
      while (input[right] > middleValue) {
        right--;
      }
      if (left !== right) await swag(left, right);
      if (left === middleIdx) {
        middleIdx = right;
      } else if (right === middleIdx) {
        middleIdx = left;
      }
    }
    await sort(start, middleIdx);
    await sort(middleIdx + 1, end);
  };
  sort();
};

export type Action =
  | {
      actionType: 'exch' | 'search';
      left: number;
      right: number;
    }
  | {
      actionType: 'middleSet';
      middle: number;
    };
export function* quickSortGenerator(input: number[]) {
  function* sort(start = 0, end = input.length): Generator<Action> {
    let middleIdx = Math.floor((start + end) / 2);
    yield {
      actionType: 'middleSet',
      middle: middleIdx
    };
    const middleValue = input[middleIdx];
    const exch = (i: number, j: number) => {
      [input[i], input[j]] = [input[j], input[i]];
    };
    let left = start,
      right = end - 1;
    if (right <= left) return;
    while (left < right) {
      while (input[left] <= middleValue && left < middleIdx) {
        yield {
          actionType: 'search',
          left,
          right
        };
        left++;
      }
      while (input[right] > middleValue) {
        yield {
          actionType: 'search',
          left,
          right
        };
        right--;
      }
      yield {
        actionType: 'search',
        left,
        right
      };
      if (left !== right) {
        exch(left, right);

        yield {
          actionType: 'exch',
          left,
          right
        };
      }
      if (left === middleIdx) {
        middleIdx = right;
        yield {
          actionType: 'middleSet',
          middle: middleIdx
        };
      } else if (right === middleIdx) {
        middleIdx = left;
        yield {
          actionType: 'middleSet',
          middle: middleIdx
        };
      }
    }
    yield* sort(start, middleIdx);

    yield* sort(middleIdx + 1, end);
  }
  yield* sort();
}

export default quickSort;
