import Konva from 'konva';
import { LayerConfig } from 'konva/types/Layer';
import { Rect } from 'konva/types/shapes/Rect';

type ListConfig = {
  maxWidth?: number | string;
  gap?: number | string;
};

const DEFAULT_STYLE = {
  fill: '#cccccc',
  stroke: 'black'
};

const DEFAULT_TAG_STYLE_MAP: {
  [key in 'left' | 'right' | 'middle']: {
    fillColor?: string;
    strokeColor?: string;
  };
} = {
  left: {
    fillColor: '#35d97a'
  },
  right: {
    fillColor: '#d052b9'
  },
  middle: {
    strokeColor: '#11888c'
  }
};
export class ListLayer extends Konva.Layer {
  private maxWidth!: number | string;
  private gap!: number | string;
  private rectList: Rect[] = [];
  private cacheList?: number[];
  private cacheBase?: {
    width: number;
    height: number;
  };
  private basePromiseList = [] as ((res: {
    width: number;
    height: number;
  }) => void)[];
  private cacheTagIndex = {
    left: -1,
    right: -1,
    middle: -1
  };

  constructor({
    maxWidth = '10%',
    gap = 0,
    ...config
  }: LayerConfig & ListConfig = {}) {
    super(config);
    this.init({ maxWidth, gap });

    this.clearBeforeDraw(true);
  }
  private init({
    maxWidth = '10%',
    gap = 0
  }: { maxWidth?: number | string; gap?: number | string } = {}) {
    // this.setBase();
    this.maxWidth = maxWidth;
    this.gap = gap;
  }

  private get base() {
    const promise = new Promise<{ width: number; height: number }>(resolve => {
      if (this.getParent()) {
        if (!this.cacheBase) {
          this.cacheBase = {
            width: this.width(),
            height: this.height()
          };
        }
        const res = this.cacheBase;
        resolve(res);
        this.basePromiseList.forEach(cb => cb(res));
        this.basePromiseList = [];
      } else {
        this.basePromiseList.push((res: { width: number; height: number }) => {
          resolve(res);
        });
      }
    });
    return promise;
  }

  drawList(list: number[]) {
    this.cacheList = list;
    this._drawList(list);
  }
  private async _drawList(list: number[]) {
    this.destroyChildren();
    const base = await this.base;
    const [width, height] = [base.width * 0.8, base.height * 0.8];
    const [maxWidth, gap] = [
      await this.percentage2Number(this.maxWidth),
      await this.percentage2Number(this.gap)
    ];
    const length = list.length;
    const maxGap = (width / length) * 0.5;
    const maxItemWidth = Math.floor(width / length);
    const _calcWidth = Math.floor(maxItemWidth - (gap > maxGap ? maxGap : gap));
    const itemWidth = _calcWidth > maxWidth ? maxWidth : _calcWidth;
    const startX = Math.ceil(0.125 * width);
    const endY = Math.ceil((1 + 0.125) * height);
    const maxValue = Math.max(...list);

    const rectList = list.map((value, idx) => {
      const itemHeight = Math.floor((value / maxValue) * height);
      const item = new Konva.Rect({
        x: idx * maxItemWidth + startX,
        y: -itemHeight,
        offset: {
          x: 0,
          y: -endY
        },
        strokeWidth: 2,
        width: itemWidth,
        height: itemHeight,

        fill: DEFAULT_STYLE.fill,
        stroke: DEFAULT_STYLE.stroke
      });

      item.on('mouseenter', () => {
        item.stroke('red');
        item.draw();
      });
      item.on('mouseleave', () => {
        item.stroke('black');
        item.draw();
      });

      return item;
    });
    this.rectList = rectList;
    this.add(...rectList);
    this.batchDraw();
  }
  async redrawRect(
    index: number,
    {
      value,
      strokeColor,
      fillColor
    }: { value?: number; strokeColor?: string; fillColor?: string }
  ) {
    const list = this.cacheList;
    if (!list) {
      console.warn('can not redraw before drawList ');
      return;
    }
    if (value === undefined && !strokeColor && !fillColor) {
      console.warn('nothing change');
      return;
    }
    const rect = this.rectList[index];

    const height = (await this.base).height * 0.8;

    if (value !== undefined) {
      const maxValue = Math.max(...list);
      const itemHeight = Math.floor((value / maxValue) * height);
      rect.height(itemHeight);
      rect.y(-itemHeight);
      list[index] = value;
    }
    if (strokeColor && rect.stroke() !== strokeColor) {
      rect.stroke(strokeColor);
    }
    if (fillColor && rect.fill() !== fillColor) {
      rect.fill(fillColor);
    }

    rect.draw();
    this.draw();
  }
  drawTaggedRectStyle(index: number, tag: 'left' | 'right' | 'middle') {
    if (index === this.cacheTagIndex[tag]) return;
    this.redrawRect(this.cacheTagIndex[tag], {
      strokeColor: DEFAULT_STYLE.stroke,
      fillColor: DEFAULT_STYLE.fill
    });
    this.redrawRect(index, DEFAULT_TAG_STYLE_MAP[tag]);
    this.cacheTagIndex[tag] = index;
  }
  getRect(index: number) {
    return this.rectList[index];
  }
  private async percentage2Number(input: number | string) {
    if (typeof input === 'number') return input;
    const percentage = Number(input.replace('%', ''));
    if (isNaN(percentage)) throw TypeError('百分比字符串有误！');
    const containerWidth = (await this.base).width;
    return Math.floor((percentage / 100) * containerWidth);
  }
}
