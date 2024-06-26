export type ChartKnowledge = {
  [chartType: string]: {
    index: number;
    visualChannels: string[]; //Visual channel available in this chart type
    examples: ((showThoughts: boolean) => string)[]; //examples of the response
    knowledge?: string[]; //extra knowledge of this chart
  };
};
