<template>
  <div id="drawer-news-list">
    <div class="title light-border-bottom">
      {{ selectedCounty }}
    </div>
    <div class="news-list">
      <newslist
        v-bind:filteredNewsList="filteredNewsList"
        v-bind:showFilter="showFilter">
      </newslist>
    </div>
  </div>
</template>

<script>
import NewsList from './NewsList'
import { mapGetters } from 'vuex';
import { getters as g } from '../store/constants'

export default {
  name: 'drawernewslist',
  props: ['showFilter'],
  computed: {
    ...mapGetters([
      g.SELECTED_COUNTY,
      g.FILTERED_NEWS_LIST,
    ]),
  },
  components: {
    'newslist': NewsList,
  },
}
</script>

<style src="../styles/DrawerNewsList.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
