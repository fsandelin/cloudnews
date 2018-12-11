<template>
  <div id="app">
    <NewsSideBar
      :showFilter="true"
    />

    <DatePicker
      v-if="showDatePicker"
    />

    <DatePickerToggler
      v-if="!showDatePicker"
    />

    <MainSection />

    <DrawerContainer>
      <Component
        :is="dynamicComponents.drawerNewsItemComponent"
        v-if="activeNewsItem !== null"
      />
      <Component
        :is="dynamicComponents.drawerNewsList"
        v-if="selectedCounty !== null && activeNewsItem === null"
        :showFilter="false"
      />
    </DrawerContainer>

    <ToggleButtons
      :items="newsSources"
      :toggleActive="toggleNewsSource"
    />
  </div>
</template>

<script>
import MainSection from './MainSection'
import DatePicker from './DatePicker'
import DatePickerToggler from './DatePickerToggler'
import DrawerNewsItem from './DrawerNewsItem'
import NewsSideBar from './NewsSideBar'
import DrawerContainer from './DrawerContainer'
import DrawerNewsList from './DrawerNewsList'
import ToggleButtons from './ToggleButtons'
import { mapGetters, mapActions } from 'vuex'
import { fakeNewsList } from '../assets/FakeData'

export default {
  name: 'App',
  components: {
    'MainSection': MainSection,
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
      'selectedCounty',
      'newsSources',
      'showDatePicker'
    ])
  },
  created: function () {
    this.fetchAvailableNewsSources()
    fakeNewsList.map(newsItem => this.addNews(newsItem))
  },
  methods: {
    ...mapActions([
      'fetchAvailableNewsSources',
      'addNews',
      'toggleNewsSource'
    ])
  }
}
</script>

<style src="../styles/App.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
