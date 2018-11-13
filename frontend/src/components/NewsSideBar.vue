<template>
  <div id="news-sidebar" class="right-shadow">
    <ul>
      <li class="header flex-centering bottom-shadow light-border-bottom">
        NEWS
      </li>
      <newsitem
        v-for="news in newsList"
        v-bind:news="news"
        v-bind:key="news.id"
        v-bind:toggleActive="toggleActive"
      >
      </newsitem>
    </ul>
  </div>
</template>

<script>
import NewsSideBarItem from './NewsSideBarItem'

export default {
  name: 'sidebar',
  props: ['newsList', 'toggleActive'],
  components: {
    'newsitem': NewsSideBarItem
  }
}
</script>

<style src="../styles/NewsSideBar.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
