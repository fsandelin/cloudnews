<template>
  <div id="app">
    <newssidebar
      v-bind:showFilter="true"
    ></newssidebar>

    <mainsection></mainsection>

    <drawer
      v-bind:isOpen="drawerIsOpen"
      v-bind:closeDrawer="closeDrawer">
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
  </div>
</template>

<script>
import Main from './Main'
import DrawerNewsItem from './DrawerNewsItem'
import NewsSideBar from './NewsSideBar'
import Drawer from './Drawer'
import DrawerNewsList from './DrawerNewsList'
import { mapGetters, mapActions } from 'vuex';

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
  created: function() {
    this.calculateNewsList();
  },
  computed: {
    ...mapGetters([
      'activeNewsItem',
      'activeNewsItemId',
      'selectedCounty',
      'newsList',
      'countyNews',
      'municipalityNews',
      'getMunicipalityByName',
      'getCountyByName'
    ]),
    drawerIsOpen: function () {
      return this.activeNewsItemId !== null || this.selectedCounty !== null
    }
  },
  methods: {
    ...mapActions([
      'closeDrawer',
      'setActiveNewsItemId',
      'addCountyNews',
      'addMunicipalityNews'
    ]),
    calculateNewsList: function() {
      for (const news of this.newsList) {
        const municipality = this.getMunicipalityByName(news.location.municipality);
        const county = this.getCountyByName(municipality.county);
        const newsMetaData = {
          municipality: municipality,
          county: county
        }

        this.addMunicipalityNews({ news, newsMetaData });
        this.addCountyNews({ news, newsMetaData });
      }
    },
  },
  components: {
    'mainsection': Main,
    'drawernewsitem': DrawerNewsItem,
    'newssidebar': NewsSideBar,
    'drawer': Drawer,
    'drawernewslist': DrawerNewsList
  }
}
</script>

<style src="../styles/App.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
