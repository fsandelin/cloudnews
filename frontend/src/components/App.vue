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
import { fakeNewsList } from '../assets/FakeData'
import europeCountries from '../assets/europe-countries-meta-info.json';
import swedishCounties from '../assets/sweden-counties-meta-info.json';
import swedishMunicipalities from '../assets/sweden-municipalities-meta-info.json';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'app',
  data () {
    return {
      counties: swedishCounties.map(x => ({ ...x, active: true })),
      municipalities: swedishMunicipalities.map(x => ({ ...x, active: false })),
      countries: europeCountries.map(x => ({ ...x, active: true })),
      countyNews: [],
      municipalityNews: [],
      newsList: fakeNewsList,
      dynamicComponents: {
        activeNewsItemComponent: 'activenewsitem',
        newsListComponent: 'newslist',
        drawerNewsList: 'drawernewslist'
      },
    }
  },
  computed: {
    ...mapGetters(['activeNewsItemId', 'selectedCounty']),
    getNewsItemByActiveId: function() {
      const newsItem = this.newsList.find(item => item.id === this.activeNewsItemId)
      return newsItem !== undefined && 'id' in newsItem ? newsItem : null;
    },
    drawerIsOpen: function () {
      return this.activeNewsItemId !== null || this.selectedCounty !== null
    }
  },
  methods: {
    ...mapActions(['closeDrawer', 'selectCounty', 'setActiveNewsItemId']),
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
      this.counties = this.counties.map(county => ({
        ...county,
        active: !(county.name === mouseoverCounty.name)
      }));

      this.countyNews = this.countyNews.map(x => {
        const _metaData = x[0]
        const _newsList = x[1]
        return [ {
          ..._metaData,
          county: {
            ..._metaData.county,
            active: !(_metaData.county.name === mouseoverCounty.name) }
        },
          _newsList ]
      })

      this.municipalities = this.municipalities.map(municipality => ({
        ...municipality,
        active: municipality.county === mouseoverCounty.name
      }));

      this.municipalityNews = this.municipalityNews.map(x => {
        const _metaData = x[0]
        const _newsList = x[1]
        return [ {
          ..._metaData,
          county: {
            ..._metaData.county,
            active: !(_metaData.county.name === mouseoverCounty.name) },
          municipality: {
            ..._metaData.municipality,
            active: (_metaData.county.name === mouseoverCounty.name) }
        },
          _newsList ]
      })

      this.setActiveNewsItemId(null)
      this.selectCounty(mouseoverCounty.name)

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
    addMunicipalityNews: function(news, newsMetaData) {
      let found = false;
      let newsForMunicipality = [newsMetaData, []];

      for (let mNews of this.municipalityNews) {
        if (mNews[0].municipality.name === newsMetaData.municipality.name) {
          newsForMunicipality = mNews;
          found = true;
        }
      }
      newsForMunicipality[1].push(news);
      if (!found) {
        this.municipalityNews.push(newsForMunicipality);
      }
    },
    addCountyNews: function(news, newsMetaData) {
      let found = false;
      let newsForCounty = [newsMetaData, []];
      for (let cNews of this.countyNews) {
        if (cNews[0].county.name === newsMetaData.county.name) {
          newsForCounty = cNews;
          found = true;
        }
      }
      newsForCounty[1].push(news);
      if(!found) {
        this.countyNews.push(newsForCounty);
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
