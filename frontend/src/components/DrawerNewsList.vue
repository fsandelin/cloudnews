<template>
  <div id="drawer-news-list">
    <div class="title light-border-bottom">
      {{ selectedCounty }}
    </div>
    <div class="news-list">
      <newslist
        v-bind:filteredNewsList="filteredNewsList"
        v-bind:showFilter="showFilter"
        v-bind:toggleActive="toggleActive">
      </newslist>
    </div>
  </div>
</template>

<script>
import NewsList from './NewsList'
import { mapGetters } from 'vuex';

export default {
  name: 'drawernewslist',
  props: ['showFilter', 'toggleActive'],
  computed: {
    ...mapGetters([
      'selectedCounty',
      'filteredNewsList',
    ]),
  },
  components: {
    'newslist': NewsList,
  },
}
</script>

<style src="../styles/DrawerNewsList.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
