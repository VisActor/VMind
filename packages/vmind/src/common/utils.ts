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
