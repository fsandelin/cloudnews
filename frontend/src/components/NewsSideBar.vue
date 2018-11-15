<template>
  <div id="news-sidebar" class="right-shadow">
      <div class="header flex-centering bottom-shadow light-border-bottom">
        NEWS
      </div>
      <newslist
        v-bind:showFilter="showFilter"
      >
      </newslist>
  </div>
</template>

<script>
import NewsList from './NewsList'

export default {
  name: 'sidebar',
  props: ['showFilter'],
  components: {
    'newslist': NewsList
  }
}
</script>

<style src="../styles/NewsSideBar.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
