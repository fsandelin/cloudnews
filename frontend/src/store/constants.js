export const mutations = {
  ADD_NEWS: 'addNews',
  ACTIVATE_NEWS_SOURCE: 'activateNewsSource',
  SELECT_COUNTY: 'selectCounty',
  SET_ZOOM_VALUE: 'setZoomValue',
  OPEN_DRAWER: 'openDrawer',
  CLOSE_DRAWER: 'closeDrawer',
  DEACTIVATE_NEWS_SOURCE: 'deactivateNewsSource',
}

export const actions = {
  ADD_NEWS: 'addNews',
  ADD_NEWS_LIST: 'addNewsList',
  ACTIVATE_NEWS_SOURCE: 'activateNewsSource',
  COUNTY_CLICK: 'countyClick',
  DEACTIVATE_NEWS_SOURCE: 'deactivateNewsSource',
  SELECT_ACTIVE_NEWS_ITEM_ID: 'setActiveNewsItemId',
  SELECT_COUNTY: 'selectCounty',
  SET_ZOOM_VALUE: 'setZoomValue',
  TOGGLE_ACTIVE: 'toggleActive',
  TOGGLE_DRAWER: 'toggleDrawer',
  TOGGLE_NEWS_SOURCE: 'toggleNewsSource',
}

export const getters = {
  ACTIVE_NEWS_ITEM: 'activeNewsItem',
  ACTIVE_NEWS_ITEM_ID: 'activeNewsItemId',
  COUNTIES: 'counties',
  COUNTRIES: 'countries',
  COUNTY_BY_NAME: 'countyByName',
  FILTERED_NEWS_LIST: 'filteredNewsList',
  MUNICIPALITIES: 'municipalities',
  NEWS_BY_COUNTY: 'newsByCounty',
  NEWS_BY_MUNICIPALITY: 'newsByMunicipality',
  NEWS_LIST: 'newsList',
  NEWS_SOURCES: 'newsSources',
  SELECTED_COUNTY: 'selectedCounty',
  ZOOM_VALUE: 'zoomValue',
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
