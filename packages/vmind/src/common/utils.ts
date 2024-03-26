export const calculateTokenUsage = (usageList: any[]) => {
  const totalUsage = {
    completion_tokens: 0,
    prompt_tokens: 0,
    total_tokens: 0
  };
  usageList.filter(Boolean).forEach(usage => {
    totalUsage['completion_tokens'] += usage['completion_tokens'] ?? 0;
    totalUsage['prompt_tokens'] += usage['prompt_tokens'] ?? 0;
    totalUsage['total_tokens'] += usage['total_tokens'] ?? 0;
  });
  return totalUsage;
};

export const execPipeline = <PipelineContext>(
  src: any,
  pipes: ((src: any, context: PipelineContext) => any)[],
  context: PipelineContext
) =>
  pipes.reduce((pre: any, pipe: (src: any, context: PipelineContext) => any) => {
    const result = pipe(pre, context);
    return result;
  }, src);

export const matchJSONStr = (str: string) => {
  const first = str.indexOf('{');
  const last = str.lastIndexOf('}');
  const result = str.substring(first, last + 1);
  return result && result.length > 0 ? result : str;
};
