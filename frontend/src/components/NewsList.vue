<template>
    <ul>
      <newslistitem
        v-for="news in newsList"
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

export default {
  name: 'newslist',
  props: ['newsList', 'showFilter', 'toggleActive'],
  components: {
    'newslistitem': NewsListItem
  },
}
</script>

<style src="../styles/NewsList.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
