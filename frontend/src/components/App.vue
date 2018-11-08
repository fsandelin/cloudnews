<template>
  <div id="app">
    <newssidebar
      v-bind:newsList="newsList"
      v-bind:toggleActive="toggleActive"
    ></newssidebar>
    <mainsection></mainsection>
    <settingssidebar></settingssidebar>
  </div>
</template>

<script>
import Main from './Main'
import NewsSideBar from './NewsSideBar'
import SettingsSideBar from './SettingsSideBar'

export default {
  name: 'app',
  data () {
    return {
      newsList: [
        { id: 0, title: "News title 0", text: "Lorem Ipsum is simply dummy text of the printing", active: false},
        { id: 1, title: "News title 0", text: "Lorem Ipsum is simply dummy text of the printing", active: false},
        { id: 2, title: "News title 0", text: "Lorem Ipsum is simply dummy text of the printing", active: false},
        { id: 3, title: "News title 0", text: "Lorem Ipsum is simply dummy text of the printing", active: false},
      ]
    }
  },
  computed: {
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
