<template>
  <div id="app">
    <newssidebar
      v-bind:newsList="newsList"
      v-bind:toggleActive="toggleActive"
    ></newssidebar>
    <mainsection
      v-bind:newsList="newsList"
    ></mainsection>
    <settingssidebar></settingssidebar>
  </div>
</template>

<script>
import Main from './Main'
import NewsSideBar from './NewsSideBar'
import SettingsSideBar from './SettingsSideBar'
import { fakeNewsList } from '../assets/FakeData'

export default {
  name: 'app',
  data () {
    return {
      newsList: fakeNewsList
    }
  },
  methods: {
    toggleActive: function(news) {
      news.active = !news.active
    }
  },
  components: {
    'mainsection': Main,
    'newssidebar': NewsSideBar,
    'settingssidebar': SettingsSideBar
  }
}
</script>

<style src="../styles/App.scss" lang="scss" scoped></style>
