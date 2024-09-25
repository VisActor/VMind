export type Cell = {
  //字段映射，可用的视觉通道：["x","y","color","size","angle","time"]
  x?: string;
  y?: string | string[];
  color?: string | string[];
  size?: string;
  angle?: string;
  radius?: string;
  time?: string;
  source?: string;
  target?: string;
  value?: string;
  category?: string;
  group?: string;
};
