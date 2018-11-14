<template>
    <ul>
      <newslistitem
        v-for="news in (filteredNewsList ? filteredNewsList : newsList)"
        v-bind:news="news"
        v-bind:key="news.id"
        v-bind:toggleActive="toggleActive"
        v-bind:showFilter="showFilter"
      >
      </newslistitem>
    </ul>
</template>

<script>
import NewsListItem from './NewsListItem'
import { mapGetters } from 'vuex';

export default {
  name: 'newslist',
  props: ['filteredNewsList', 'showFilter', 'toggleActive'],
  computed: {
    ...mapGetters([
      'newsList',
    ]),
  },
  components: {
    'newslistitem': NewsListItem
  },
}
</script>

<style src="../styles/NewsList.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
