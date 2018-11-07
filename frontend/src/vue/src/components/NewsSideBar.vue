<template>
  <div id="sidebar">
    <ul>
      <li class="header">
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
