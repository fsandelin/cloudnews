<template>
    <ul>
      <newslistitem
        v-for="news in newsList"
        v-bind:news="news"
        v-bind:key="news.id"
        v-bind:activeNewsItemId="activeNewsItemId"
        v-bind:toggleActive="toggleActive"
        v-bind:getMunicipalityByName="getMunicipalityByName"
        v-bind:selectedCounty="selectedCounty"
        v-bind:showFilter="showFilter"
      >
      </newslistitem>
    </ul>
</template>

<script>
import NewsListItem from './NewsListItem'

export default {
  name: 'newslist',
  props: ['newsList', 'showFilter', 'activeNewsItemId', 'getMunicipalityByName', 'toggleActive', 'selectedCounty'],
  components: {
    'newslistitem': NewsListItem
  },
}
</script>

<style src="../styles/NewsList.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
