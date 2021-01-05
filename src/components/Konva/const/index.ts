export type KonvaNodeType =
  | 'Layer'
  | 'FastLayer'
  | 'Group'
  | 'Label'
  | 'Rect'
  | 'Circle'
  | 'Ellipse'
  | 'Wedge'
  | 'Line'
  | 'Sprite'
  | 'Image'
  | 'Text'
  | 'TextPath'
  | 'Star'
  | 'Ring'
  | 'Arc'
  | 'Tag'
  | 'Path'
  | 'RegularPolygon'
  | 'Arrow'
  | 'Shape'
  | 'Transformer';

export const KONVA_NODES: KonvaNodeType[] = [
  'Layer',
  'FastLayer',
  'Group',
  'Label',
  'Rect',
  'Circle',
  'Ellipse',
  'Wedge',
  'Line',
  'Sprite',
  'Image',
  'Text',
  'TextPath',
  'Star',
  'Ring',
  'Arc',
  'Tag',
  'Path',
  'RegularPolygon',
  'Arrow',
  'Shape',
  'Transformer'
];

export const EVENTS_NAMESPACE = '.vue-konva-event';

export const CONTAINERS = {
  Group: true,
  Layer: true,
  FastLayer: true,
  Label: true
};
