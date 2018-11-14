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

    <mainsection
      v-bind:newsList="newsList"
      v-bind:municipalities="municipalities"
      v-bind:counties="counties"
      v-bind:countries="countries"
      v-bind:municipalityNews="municipalityNews"
      v-bind:countyNews="countyNews"
      v-bind:countyClick="countyClick"
      v-bind:addMunicipalityNews="addMunicipalityNews"
      v-bind:addCountyNews="addCountyNews"
      v-bind:getMunicipalityByName="getMunicipalityByName">
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
  computed: {
    ...mapGetters([
      'activeNewsItemId',
      'selectedCounty',
      'newsList',
      'countyNews',
      'municipalityNews',
      'countries',
      'counties',
      'municipalities'
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
      'selectCounty',
      'setActiveNewsItemId',
      'addCountyNews',
      'addMunicipalityNews'
    ]),
    toggleHover: function(news) {
      news.hover = !news.hover
    },
    toggleActive: function(news) {
      if (news.id === this.activeNewsItemId) {
        this.closeDrawer()
      } else {
        this.setActiveNewsItemId(news.id)
      }
    },
    countyClick: function(mouseoverCounty) {
      this.selectCounty(mouseoverCounty.name)
      this.setActiveNewsItemId(null)
    },
    getMunicipalityByName: function(name) {
      if (name === undefined) {
        return null;
      }

      for (const municipality of this.municipalities) {
        if(name.toLowerCase().trim() === municipality.name.toLowerCase().trim()) {
          return municipality;
        }
      }
    },
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
