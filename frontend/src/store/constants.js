export const mutations = {
  ADD_NEWS: 'addNews',
  SELECT_COUNTY: 'selectCounty',
}

export const actions = {
  ADD_NEWS_SOURCE: 'addNewsSource',
  ADD_NEWS: 'addNews',
  ADD_NEWS_LIST: 'addNewsList',
  TOGGLE_DRAWER: 'toggleDrawer',
  SELECT_ACTIVE_NEWS_ITEM_ID: 'setActiveNewsItemId',
  SELECT_COUNTY: 'selectCounty',
}

export const newsSources = {
  SVT: 'svt',
  TT: 'tt'
}

export const socketEvents = {
  NEWS: 'news',
  NEWS_LIST: 'news_list'
}

export const socketBaseUrl = 'http://localhost:3020/'
export const socketServiceUrl = `${socketBaseUrl}?services=`
