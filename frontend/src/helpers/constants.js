export const socketEvents = {
  NEWS: 'news',
  NEWS_LIST: 'news_list',
  TIMESPAN_REQUEST: 'timespan_request',
  COMPLETE_REQUEST: 'complete_request'
}

export const baseUrl = process.env.NODE_ENV !== 'production' ? 'http://localhost:5001/' : 'http://back.cloudnews.student.it.uu.se:8091/'
export const socketServiceUrl = `${baseUrl}?services=`

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
