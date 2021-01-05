import { defineComponent, onMounted, ref } from 'vue';
import './index.css';
import Konva from 'konva';
import { BaseScene } from './style';
import { ListLayer } from './components/ListLayer';
import { Action, quickSortGenerator } from './sort/quickSort';
import sleep from '/src/utils/sleep';

const getRandomList = (length = 30, max = 1000, min = 10) =>
  Array.from(
    {
      length
    },
    () => Math.floor((max - min) * Math.random()) + min
  );
type RecordType =
  | {
      actionType: 'exch';
      left: number;
      right: number;
      changeValueMap: {
        [x: number]: number;
      };
    }
  | {
      actionType: 'search';
      left: number;
      right: number;
    }
  | {
      actionType: 'middleSet';
      middle: number;
    };
const createQuickSortStepRecord = (list: number[]) => {
  const copyList = [...list];
  const qsg = quickSortGenerator(copyList);

  const recordList: RecordType[] = [];
  for (let action of qsg) {
    recordList.push(
      (action.actionType === 'exch'
        ? {
            ...action,
            changeValueMap: {
              [action.left]: copyList[action.left],
              [action.right]: copyList[action.right]
            }
          }
        : action) as RecordType
    );
  }
  console.log(recordList.filter(val => val.actionType === 'exch'));
  return recordList;
};
const SortAni = defineComponent({
  name: 'SortAni',
  setup() {
    const containerRef = ref<HTMLDivElement>();
    const _list = getRandomList(100, 10000, 100);
    const sortRecord = createQuickSortStepRecord(_list);
    const list = new ListLayer();
    const activeStep = ref(0);
    const isAutoSort = ref(false);
    const autoSortFn = ref(() => {});
    const decoratorLayer = new Konva.Layer();
    decoratorLayer.zIndex(10);

    const triangleTag = new Konva.RegularPolygon({
      sides: 3,
      radius: 0,
      fill: 'red',
      rotation: 60
    });

    const render = (index: number, isRevert = false) => {
      const record = sortRecord[index];
      if (!record) return;
      switch (record.actionType) {
        case 'exch': {
          const { left, right, changeValueMap } = record;
          list.redrawRect(left, {
            value: changeValueMap[isRevert ? right : left]
          });
          list.redrawRect(right, {
            value: changeValueMap[isRevert ? left : right]
          });

          break;
        }
        case 'search': {
          if (isRevert) {
            render(index - 1);
          }
          const { left, right } = record;
          list.drawTaggedRectStyle(left, 'left');
          list.drawTaggedRectStyle(right, 'right');

          break;
        }
        case 'middleSet': {
          if (isRevert) {
            render(index - 1);
          }
          const { middle } = record;
          list.drawTaggedRectStyle(middle, 'middle');
          const targetRect = list.getRect(middle);
          const { x, y, width } = targetRect.getClientRect();
          triangleTag.width(width);
          triangleTag.x(x + width / 2);
          triangleTag.y(y - width * 0.8);
          decoratorLayer.add(triangleTag);
          triangleTag.draw();
          decoratorLayer.draw();
          break;
        }
      }
    };
    onMounted(async () => {
      const stageWidth = window.innerWidth;
      const stage = new Konva.Stage({
        container: containerRef.value!,
        width: stageWidth,
        height: window.innerHeight * 0.8
      });

      stage.add(list);
      stage.add(decoratorLayer);
      list.drawList(_list);
      window.addEventListener('resize', () => {
        const containerWidth = containerRef.value!.offsetWidth;
        const scale = containerWidth / stageWidth;

        stage.width(containerWidth);
        stage.scaleX(scale);
        stage.draw();
      });

      const autoSorter = async () => {
        while (activeStep.value < sortRecord.length) {
          if (!isAutoSort.value) {
            await new Promise<void>(resolve => {
              autoSortFn.value = () => {
                resolve();
              };
            });
          }
          const record = sortRecord[activeStep.value];
          render(activeStep.value++);
          if (record.actionType === 'exch') await sleep(50);
          else if (record.actionType === 'search') await sleep(20);
        }
      };
      autoSorter();
    });
    const start = () => {
      isAutoSort.value = true;
      autoSortFn.value();
    };
    const stop = () => {
      isAutoSort.value = false;
    };
    const nextStep = () => {
      if (activeStep.value < sortRecord.length) render(activeStep.value++);
    };
    const revertStep = () => {
      if (activeStep.value >= 0) render(activeStep.value--, true);
    };

    return () => (
      <div class="full-screen">
        <BaseScene
          ref={(res: any) => {
            containerRef.value = res.$el;
          }}
        />
        <div>
          <button onClick={nextStep}>next</button>
          <button onClick={revertStep}>before</button>
        </div>
        <div onClick={start}>start sort</div>
        <div onClick={stop}>pause sort</div>
      </div>
    );
  }
});

export default SortAni;
