<template>
  <div
    id="news-sidebar"
    class="right-shadow"
    @click="toggleAboutPage">
    <div class="header flex-col bottom-shadow light-border-bottom">
      <img
        class="logo"
        :src="logoWithText"
        :alt="logoWithTextAlt">
    </div>
    <Newslist :showFilter="showFilter" />
  </div>
</template>

<script>
import NewsList from './NewsList'
import LogoWithText from '../assets/LogoWithText.png'
import { mapActions } from 'vuex'

export default {
  name: 'Sidebar',
  components: {
    'Newslist': NewsList
  },
  props: {
    'showFilter': {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      logoWithText: LogoWithText,
      logoWithTextAlt: 'LogoWithText'
    }
  },
  methods: {
    ...mapActions([
      'toggleAboutPage'
    ])
  }
}
</script>

<style src="../styles/NewsSideBar.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
