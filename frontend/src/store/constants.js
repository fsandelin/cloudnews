export const newsSources = [
  'svt', 'twitter', 'polisen'
]

export const socketEvents = {
  NEWS: 'news',
  NEWS_LIST: 'news_list',
  TIMESPAN_REQUEST: 'timespan_request',
  COMPLETE_REQUEST: 'complete_request'
}

export const socketBaseUrl = 'http://localhost:5001/'
export const socketServiceUrl = `${socketBaseUrl}?services=`

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
