<template>
  <div id="app">
    <newssidebar
      v-bind:showFilter="true"
    ></newssidebar>

    <mainsection></mainsection>

    <drawer
      v-bind:isOpen="drawerIsOpen"
      v-bind:toggleDrawer="toggleDrawer">
      <component
        v-if="activeNewsItem !== null"
        v-bind:is="dynamicComponents.drawerNewsItemComponent">
      </component>

      <component
        v-if="selectedCounty !== null && this.activeNewsItem === null"
        v-bind:showFilter="false"
        v-bind:is="dynamicComponents.drawerNewsList">
      </component>
    </drawer>

    <togglebuttons
      v-bind:items="newsSources"
      v-bind:toggleActive="toggleNewsSource">
    </togglebuttons>
  </div>
</template>

<script>
import Main from './Main'
import DrawerNewsItem from './DrawerNewsItem'
import NewsSideBar from './NewsSideBar'
import Drawer from './Drawer'
import DrawerNewsList from './DrawerNewsList'
import ToggleButtons from './ToggleButtons'
import { mapGetters, mapActions } from 'vuex';
import { fakeNewsList } from '../assets/FakeData'

export default {
  name: 'app',
  data () {
    return {
      dynamicComponents: {
        drawerNewsItemComponent: 'drawernewsitem',
        newsListComponent: 'newslist',
        drawerNewsList: 'drawernewslist'
      },
    }
  },
  created: function () {
    fakeNewsList.map(newsItem => this.addNews(newsItem))
  },
  computed: {
    ...mapGetters([
      'activeNewsItem',
      'activeNewsItemId',
      'selectedCounty',
      'newsSources'
    ]),
    drawerIsOpen: function () {
      return this.activeNewsItemId !== null || this.selectedCounty !== null
    }
  },
  methods: {
    ...mapActions([
      'addNews',
      'toggleDrawer',
      'toggleNewsSource',
    ]),
  },
  components: {
    'mainsection': Main,
    'drawernewsitem': DrawerNewsItem,
    'newssidebar': NewsSideBar,
    'drawer': Drawer,
    'drawernewslist': DrawerNewsList,
    'togglebuttons': ToggleButtons
  }
}
</script>

<style src="../styles/App.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
