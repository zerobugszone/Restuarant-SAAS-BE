import moment from 'moment';

export const getFormattedDate = (
  value: string | Date,
  format: string = 'YYYY/MM/DD hh:mm:ss',
): string | undefined => {
  if (!value) {
    return undefined;
  }
  return moment(value).format(format);
};

export const getFormattedWithDateOnly = (
  value: string | Date,
  format: string = 'YYYY/MM/DD',
): string | undefined => {
  if (!value) {
    return undefined;
  }
  return moment(value).format(format);
};

export const getTodayDate = (
  format: string = 'MM/DD/YYYY hh:mm:ss',
): string => {
  return moment().format(format);
};

export const getFormattedTodayDate = (
  format: string = 'YYYYMMDD-HHmmss',
): string => {
  return moment().format(format);
};
