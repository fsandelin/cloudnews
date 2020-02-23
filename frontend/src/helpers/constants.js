export const socketEvents = {
  NEWS: 'news',
  NEWS_LIST: 'news_list',
  TIMESPAN_REQUEST: 'timespan_request',
  COMPLETE_REQUEST: 'complete_request'
}

const serverUrl = process.env.NODE_ENV !== 'production' ? 'http://localhost:5001/' : 'https://cloudnews.sandelin.dev/';
export const baseUrl = process.env.NODE_ENV !== 'production' ? serverUrl : `${serverUrl}app/`;
export const socketServiceServer = `${serverUrl}`
export const socketServicePath = process.env.NODE_ENV !== 'production' ? '' : `/app`;

export const months = {
  JANUARY: 'January',
  FEBRUARY: 'February',
  MARCH: 'March',
  APRIL: 'April',
  MAY: 'May',
  JUNE: 'June',
  JULY: 'July',
  AUGUST: 'August',
  SEPTEMBER: 'September',
  OCTOBER: 'October',
  NOVEMBER: 'November',
  DECEMBER: 'December'
}

export const weekDays = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday'
}

export const TOTAL_DAYS_TO_SHOW = 42
