export const getLanguageOfText = (text: string) => {
  const chineseRegex = /[\u4e00-\u9fa5]/;

  const chineseMatch = text.match(chineseRegex);
  if (chineseMatch) {
    return 'chinese';
  }
  return 'english';
};
