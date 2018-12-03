<template>
  <div id="news-sidebar" class="right-shadow">
      <div class="header flex-centering bottom-shadow light-border-bottom">
        <img
          class="logo"
          v-bind:src="logoWithText"
          v-bind:alt="logoWithTextAlt">
      </div>
      <newslist v-bind:showFilter="showFilter">
      </newslist>
  </div>
</template>

<script>
import NewsList from './NewsList'
import LogoWithText from '../assets/LogoWithText.png'

export default {
  name: 'sidebar',
  props: ['showFilter'],
  data () {
    return {
      logoWithText: LogoWithText,
      logoWithTextAlt: "LogoWithText",
    }
  },
  components: {
    'newslist': NewsList
  }
}
</script>

<style src="../styles/NewsSideBar.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
