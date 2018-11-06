<template>
  <div id="app">
    <sidebar
      v-bind:newsList="newsList"
      v-bind:toggleActive="toggleActive"
    ></sidebar>
  </div>
</template>

<script>
import SideBar from './SideBar'

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
    'sidebar': SideBar
  }
}
</script>

<style src="../styles/App.scss" lang="scss" scoped></style>
