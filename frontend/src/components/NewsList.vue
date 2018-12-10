<template>
  <ul>
    <NewslistItem
      v-for="news in (filteredNewsList ? filteredNewsList : newsList).filter((news) => inCorrectTimeSpan(news))"
      :key="news.id"
      :news="news"
      :showFilter="showFilter"
    />
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
      'newsList',
      'newsStartDate',
      'newsEndDate'
    ])
  },
  methods: {
    inCorrectTimeSpan: function (news) {
      const currentStartDate = this.newsStartDate
      const currentEndDate = this.newsEndDate
      console.log('A')
      if (!this.newsStartDate || !this.newsEndDate) return true

      return currentStartDate.year <= news.dateTime.year && news.dateTime.year <= currentEndDate.year &&
        currentStartDate.month <= news.dateTime.month && news.dateTime.month <= currentEndDate.month &&
        currentStartDate.day <= news.dateTime.day && news.dateTime.day <= currentEndDate.day
    }
  }
}
</script>

<style src="../styles/NewsList.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
