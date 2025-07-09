import dayjs from 'dayjs';

export function isInteger(value: any) {
  return typeof value === 'number' && Number.isInteger(value);
}

const dateFormats = [
  {
    key: 'YYYY年MM月DD日',
    regex: /^(\d{4})年(\d{1,2})月(\d{1,2})日$/,
    format: (match: string, year: string, month: string, day: string) =>
      `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  },

  {
    key: 'MM月DD日YYYY年',
    regex: /^(\d{1,2})月(\d{1,2})日(\d{4})年$/,
    format: (match: string, month: string, day: string, year: string) =>
      `${year}-${month.padStart(2, '0')}-${year.padStart(2, '0')}`
  },

  {
    key: 'YYYY年MM月',
    regex: /^(\d{4})年(\d{1,2})月$/,
    format: (match: string, year: string, month: string) => `${year}-${month.padStart(2, '0')}`
  },

  { key: 'YYYY年', regex: /^(\d{4})年$/, format: (match: string, year: string) => `${year}` },

  { key: 'MM月', regex: /^(\d{1,2})月$/, format: (match: string, month: string) => `${month.padStart(2, '0')}` },
  {
    key: 'MM月DD日',
    regex: /^(\d{1,2})月(\d{1,2})日$/,
    format: (match: string, month: string, day: string) => `${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }
];
function isQuarterDate(date: string) {
  const patterns = [/^\d{4}-Q[1-4]$/, /^\d{4}年第[一二三四]季度$/, /^Q[1-4]$/, /^\d{4}年-Q[1-4]$/];
  return patterns.some(pattern => pattern.test(date));
}

export function validateDate(date: any) {
  const formaterDate = `${date}`.trim();
  //check if the string is a data string
  return (
    dayjs(formaterDate).isValid() ||
    dateFormats.find(v => new Date(formaterDate.replace(v.regex, v.format)).toString() !== 'Invalid Date') ||
    isQuarterDate(formaterDate)
  );
}
