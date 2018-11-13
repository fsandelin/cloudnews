<template>
  <div id="drawer-news-list">
    <div class="title light-border-bottom">
      {{ selectedRegion }}
    </div>
    <newslist
      v-bind:newsList="filteredNewsList"
      v-bind:activeNewsItemId="activeNewsItemId"
      v-bind:toggleHover="toggleHover"
      v-bind:toggleActive="toggleActive">
    </newslist>
  </div>
</template>

<script>
import NewsList from './NewsList'

export default {
  name: 'drawernewslist',
  props: ['selectedRegion', 'newsList', 'activeNewsItemId', 'toggleHover', 'toggleActive'],
  data () {
    return {
      filteredNewsList: this.newsList.filter(news => news.region === this.selectedRegion)
    }
  },
  components: {
    'newslist': NewsList,
  }
}
</script>

<style src="../styles/DrawerNewsList.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
