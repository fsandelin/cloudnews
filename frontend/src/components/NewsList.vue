<template>
    <ul>
      <newslistitem
        v-for="news in newsList"
        v-bind:news="news"
        v-bind:key="news.id"
        v-bind:activeNewsItemId="activeNewsItemId"
        v-bind:toggleHover="toggleHover"
        v-bind:toggleActive="toggleActive"
      >
      </newslistitem>
    </ul>
</template>

<script>
import NewsListItem from './NewsListItem'

export default {
  name: 'sidebar',
  props: ['newsList', 'activeNewsItemId', 'toggleHover', 'toggleActive'],
  components: {
    'newslistitem': NewsListItem
  }
}
</script>

<style src="../styles/NewsList.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
