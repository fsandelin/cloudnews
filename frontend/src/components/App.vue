<template>
  <div id="app">
    <NewsSideBar :showFilter="true" />

    <PopUpContainer v-if="showPopUp">
      <AboutPage v-if="showAboutPage" />
      <DatePicker v-if="showDatePicker" />
    </PopUpContainer>

    <DatePickerToggler />

    <MapSVG />

    <DrawerContainer
      :isOpen="drawerIsOpen">
      <Component
        :is="dynamicComponents.drawerNewsItemComponent"
        v-if="activeNewsItem !== null" />
      <Component
        :is="dynamicComponents.drawerNewsList"
        v-if="selectedCounty !== null && activeNewsItem === null"
        :showFilter="false" />
    </DrawerContainer>

    <ToggleButtons
      :items="newsSources"
      :toggleActive="toggleNewsSource" />
  </div>
</template>

<script>
import AboutPage from './AboutPage'
import MapSVG from './Map/MapSVG'
import PopUpContainer from './PopUpContainer'
import DatePicker from './DatePicker/DatePicker'
import DatePickerToggler from './DatePicker/DatePickerToggler'
import DrawerContainer from './Drawer/DrawerContainer'
import DrawerNewsItem from './Drawer/DrawerNewsItem'
import DrawerNewsList from './Drawer/DrawerNewsList'
import NewsSideBar from './News/NewsSideBar'
import ToggleButtons from './ToggleButtons'
import { mapGetters, mapActions } from 'vuex'
import { fakeNewsList } from '../assets/FakeData'

export default {
  name: 'App',
  components: {
    'AboutPage': AboutPage,
    'MapSVG': MapSVG,
    'PopUpContainer': PopUpContainer,
    'DatePicker': DatePicker,
    'DatePickerToggler': DatePickerToggler,
    'drawernewsitem': DrawerNewsItem,
    'NewsSideBar': NewsSideBar,
    'DrawerContainer': DrawerContainer,
    'drawernewslist': DrawerNewsList,
    'ToggleButtons': ToggleButtons
  },
  data () {
    return {
      dynamicComponents: {
        drawerNewsItemComponent: 'drawernewsitem',
        newsListComponent: 'newslist',
        drawerNewsList: 'drawernewslist'
      }
    }
  },
  computed: {
    ...mapGetters([
      'activeNewsItem',
      'activeNewsItemId',
      'selectedCounty',
      'newsSources',
      'showDatePicker',
      'showAboutPage'
    ]),
    drawerIsOpen: function () {
      return this.activeNewsItemId !== null || this.selectedCounty !== null
    },
    showPopUp: function () {
      return this.showDatePicker || this.showAboutPage
    }
  },
  created: function () {
    this.fetchAvailableNewsSources()
    fakeNewsList.map(newsItem => this.addNews(newsItem))
  },
  methods: {
    ...mapActions([
      'fetchAvailableNewsSources',
      'addNews',
      'toggleDrawer',
      'toggleNewsSource'
    ])
  }
}
</script>

<style src="../styles/App.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
