<template>
  <div id="drawer-news-list">
    <div class="title light-border-bottom">
      {{ selectedCounty }}
    </div>
    <div class="news-list">
      <newslist
        v-bind:newsList="filteredNewsList"
        v-bind:showFilter="showFilter"
        v-bind:toggleActive="toggleActive">
      </newslist>
    </div>
  </div>
</template>

<script>
import NewsList from './NewsList'

export default {
  name: 'drawernewslist',
  props: ['selectedCounty', 'showFilter', 'newsList', 'toggleActive', 'getMunicipalityByName'],
  computed: {
    filteredNewsList: function () {
      return this.newsList.filter(news => {
        const municipality = this.getMunicipalityByName(news.location.municipality)
        const countyName = municipality !== null ? municipality.county : null
        return countyName === this.selectedCounty
      })
    }
  },
  components: {
    'newslist': NewsList,
  },
}
</script>

<style src="../styles/DrawerNewsList.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
