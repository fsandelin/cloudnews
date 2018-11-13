<template>
  <div id="app">
    <newssidebar
      v-bind:newsList="newsList"
      v-bind:activeNewsItem="activeNewsItem"
      v-bind:toggleHover="toggleHover"
      v-bind:toggleActive="toggleActive"
    ></newssidebar>
    <mainsection></mainsection>
    <drawer></drawer>
  </div>
</template>

<script>
import Main from './Main'
import NewsSideBar from './NewsSideBar'
import Drawer from './Drawer'

export default {
  name: 'app',
  data () {
    return {
      newsList: [
        { id: 0, title: "News title 0", text: "Lorem Ipsum is simply dummy text of the printing", hover: false},
        { id: 1, title: "News title 0", text: "Lorem Ipsum is simply dummy text of the printing", hover: false},
        { id: 2, title: "News title 0", text: "Lorem Ipsum is simply dummy text of the printing", hover: false},
        { id: 3, title: "News title 0", text: "Lorem Ipsum is simply dummy text of the printing", hover: false},
      ],
      activeNewsItem: {

      }
    }
  },
  computed: {
  },
  methods: {
    toggleHover: function(news) {
      news.hover = !news.hover
    },
    toggleActive: function(news) {
      if (news.id === this.activeNewsItem.id) {
        this.activeNewsItem = {}
      } else {
        this.activeNewsItem = news
      }
    }
  },
  components: {
    'mainsection': Main,
    'newssidebar': NewsSideBar,
    'drawer': Drawer
  }
}
</script>

<style src="../styles/App.scss" lang="scss" scoped></style>
