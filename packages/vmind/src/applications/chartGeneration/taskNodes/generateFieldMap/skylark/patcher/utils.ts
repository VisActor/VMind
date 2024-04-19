export const matchFieldWithoutPunctuation = (field: string, fieldList: string[]): string | undefined => {
  //try to match the field without punctuation
  //return undefined if no field is match
  if (!field) {
    return field;
  }
  const punctuationRegex = /[.,\/#!$%\^&\*;:{}=\-_`~()\s]/g;
  const pureFieldStr = field.replace(punctuationRegex, '');
  let matchedField = undefined;
  fieldList.some((f: string) => {
    const pureStr = f.replace(punctuationRegex, '');
    if (pureStr === pureFieldStr) {
      matchedField = f;
      return true;
    }
    return false;
  });
  return matchedField;
};
