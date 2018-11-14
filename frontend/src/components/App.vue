<template>
  <div id="app">
    <newssidebar
      v-bind:newsList="newsList"
      v-bind:activeNewsItemId="activeNewsItemId"
      v-bind:selectedCounty="selectedCounty"
      v-bind:toggleHover="toggleHover"
      v-bind:getMunicipalityByName="getMunicipalityByName"
      v-bind:toggleActive="toggleActive"
      v-bind:showFilter="true"
    ></newssidebar>

    <mainsection>
    </mainsection>

    <drawer
      v-bind:isOpen="drawerIsOpen"
      v-bind:closeDrawer="closeDrawer">
      <component
        v-if="getNewsItemByActiveId !== null"
        v-bind:getNewsItemByActiveId="getNewsItemByActiveId"
        v-bind:is="dynamicComponents.activeNewsItemComponent">
      </component>

      <component
        v-if="selectedCounty !== null && getNewsItemByActiveId === null"
        v-bind:selectedCounty="selectedCounty"
        v-bind:newsList="newsList"
        v-bind:activeNewsItemId="activeNewsItemId"
        v-bind:toggleHover="toggleHover"
        v-bind:toggleActive="toggleActive"
        v-bind:getMunicipalityByName="getMunicipalityByName"
        v-bind:showFilter="false"
        v-bind:is="dynamicComponents.drawerNewsList">
      </component>
    </drawer>
  </div>
</template>

<script>
import Main from './Main'
import ActiveNewsItem from './ActiveNewsItem'
import NewsSideBar from './NewsSideBar'
import Drawer from './Drawer'
import DrawerNewsList from './DrawerNewsList'
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'app',
  data () {
    return {
      dynamicComponents: {
        activeNewsItemComponent: 'activenewsitem',
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
      'activeNewsItemId',
      'selectedCounty',
      'newsList',
      'countyNews',
      'municipalityNews',
      'getMunicipalityByName',
      'getCountyByName'
    ]),
    getNewsItemByActiveId: function() {
      const newsItem = this.newsList.find(item => item.id === this.activeNewsItemId)
      return newsItem !== undefined && 'id' in newsItem ? newsItem : null;
    },
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
        this.addCountyNews({ news, newsMetaData })
      }
    },
    toggleHover: function(news) {
      news.hover = !news.hover
    },
    toggleActive: function(news) {
      if (news.id === this.activeNewsItemId) {
        this.closeDrawer()
      } else {
        this.setActiveNewsItemId(news.id)
      }
    }
  },
  components: {
    'mainsection': Main,
    'activenewsitem': ActiveNewsItem,
    'newssidebar': NewsSideBar,
    'drawer': Drawer,
    'drawernewslist': DrawerNewsList
  }
}
</script>

<style src="../styles/App.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
