export const calculateTokenUsage = (usageList: any[]) => {
  let totalUsage = 0;
  usageList.filter(Boolean).forEach(usage => {
    //totalUsage += usage['prompt_tokens'] ?? 0
    //totalUsage += usage['completion_tokens'] ?? 0
    totalUsage += usage['total_tokens'] ?? 0;
  });
  return totalUsage;
};
