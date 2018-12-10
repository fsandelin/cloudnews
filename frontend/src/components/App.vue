<template>
  <div id="app">
    <NewsSideBar :showFilter="true" />
    <PopUpContainer>
      <div>
        "ok"
      </div>
    </PopUpContainer>

    <DatePicker v-if="showDatePicker" />

    <DatePickerToggler v-if="!showDatePicker" />

    <MainSection />

    <Drawer
      :isOpen="drawerIsOpen"
      :toggleDrawer="toggleDrawer"
    >
      <Component
        :is="dynamicComponents.drawerNewsItemComponent"
        v-if="activeNewsItem !== null"
      />
      <Component
        :is="dynamicComponents.drawerNewsList"
        v-if="selectedCounty !== null && activeNewsItem === null"
        :showFilter="false"
      />
    </Drawer>

    <ToggleButtons
      :items="newsSources"
      :toggleActive="toggleNewsSource"
    />
  </div>
</template>

<script>
import MainSection from './MainSection'
import PopUpContainer from './PopUpContainer'
import DatePicker from './DatePicker'
import DatePickerToggler from './DatePickerToggler'
import DrawerNewsItem from './DrawerNewsItem'
import NewsSideBar from './NewsSideBar'
import Drawer from './Drawer'
import DrawerNewsList from './DrawerNewsList'
import ToggleButtons from './ToggleButtons'
import { mapGetters, mapActions } from 'vuex'
import { fakeNewsList } from '../assets/FakeData'

export default {
  name: 'App',
  components: {
    'MainSection': MainSection,
    'PopUpContainer': PopUpContainer,
    'DatePicker': DatePicker,
    'DatePickerToggler': DatePickerToggler,
    'drawernewsitem': DrawerNewsItem,
    'NewsSideBar': NewsSideBar,
    'Drawer': Drawer,
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
      'showDatePicker'
    ]),
    drawerIsOpen: function () {
      return this.activeNewsItemId !== null || this.selectedCounty !== null
    }
  },
  created: function () {
    fakeNewsList.map(newsItem => this.addNews(newsItem))
  },
  methods: {
    ...mapActions([
      'addNews',
      'toggleDrawer',
      'toggleNewsSource'
    ])
  }
}
</script>

<style src="../styles/App.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
