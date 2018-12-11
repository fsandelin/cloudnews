<template>
  <ul>
    <NewslistItem
      v-for="news in (filteredNewsList ? filteredNewsList : newsList)"
      :key="news.id"
      :news="news"
      :showFilter="showFilter" />
  </ul>
</template>

<script>
import NewsListItem from './NewsListItem'
import { mapGetters } from 'vuex'

export default {
  name: 'Newslist',
  components: {
    'NewslistItem': NewsListItem
  },
  props: {
    'filteredNewsList': {
      type: Array,
      default: null
    },
    'showFilter': {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'newsList'
    ])
  }
}
</script>

<style src="../styles/NewsList.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
