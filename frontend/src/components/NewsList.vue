<template>
  <VirtualList
    class="scroller"
    :remain="14"
    :size="101">
    <NewslistItem
      v-for="item in (filteredNewsList ? filteredNewsList : newsList)"
      :key="item.id"
      :news="item"
      :showFilter="showFilter" />
  </VirtualList>
</template>

<script>
import NewsListItem from './NewsListItem'
import virtualList from 'vue-virtual-scroll-list'
import { mapGetters } from 'vuex'

export default {
  name: 'Newslist',
  components: {
    'NewslistItem': NewsListItem,
    'VirtualList': virtualList
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
