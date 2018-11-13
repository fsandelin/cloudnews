<template>
    <ul>
      <newsitem
        v-for="news in newsList"
        v-bind:news="news"
        v-bind:key="news.id"
        v-bind:activeNewsItem="activeNewsItem"
        v-bind:toggleHover="toggleHover"
        v-bind:toggleActive="toggleActive"
      >
      </newsitem>
    </ul>
</template>

<script>
import NewsItem from './NewsItem'

export default {
  name: 'sidebar',
  props: ['newsList', 'activeNewsItem', 'toggleHover', 'toggleActive'],
  components: {
    'newsitem': NewsItem
  }
}
</script>

<style src="../styles/NewsList.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
