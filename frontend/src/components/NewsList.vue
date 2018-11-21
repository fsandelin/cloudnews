<template>
    <ul>
      <newslistitem
        v-for="news in (filteredNewsList ? filteredNewsList : newsList)"
        v-bind:news="news"
        v-bind:key="news.id"
        v-bind:showFilter="showFilter"
      >
      </newslistitem>
    </ul>
</template>

<script>
import NewsListItem from './NewsListItem'
import { mapGetters } from 'vuex';
import { getters as g } from '../store/constants'

export default {
  name: 'newslist',
  props: ['filteredNewsList', 'showFilter'],
  computed: {
    ...mapGetters([
      g.NEWS_LIST,
    ]),
  },
  components: {
    'newslistitem': NewsListItem
  },
}
</script>

<style src="../styles/NewsList.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
