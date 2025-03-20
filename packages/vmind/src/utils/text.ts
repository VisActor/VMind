export const getLanguageOfText = (text: string) => {
  const chineseRegex = /[\u4e00-\u9fa5]/;

  const chineseMatch = (text || '').match(chineseRegex);
  if (chineseMatch) {
    return 'chinese';
  }
  return 'english';
};

export const capitalize = (str: any) => {
  if (typeof str !== 'string') {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const replaceAll = (originStr: string, replaceStr: string, newStr: string) => {
  return originStr.split(replaceStr).join(newStr);
};

export const extractFirstNumberInString = (str: string) => {
  const regex = /\d+/g;
  const matches = str.match(regex);

  return matches ? matches.map(Number)[0] : null;
};
