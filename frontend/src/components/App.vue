<template>
  <div id="app">
    <newssidebar
      v-bind:newsList="newsList"
      v-bind:activeNewsItemId="activeNewsItemId"
      v-bind:toggleHover="toggleHover"
      v-bind:toggleActive="toggleActive"
    ></newssidebar>
    <mainsection></mainsection>

    <drawer
      v-bind:isOpen="drawerIsOpen"
      v-bind:closeDrawer="closeDrawer">
      <component
        v-if="getNewsItemByActiveId !== null"
        v-bind:getNewsItemByActiveId="getNewsItemByActiveId"
        v-bind:is="dynamicComponents.activeNewsItemComponent">
      </component>
      <component
        v-if="regionSelected && activeNewsItemId === null"
        v-bind:is="dynamicComponents.newslist">
      </component>
    </drawer>
  </div>
</template>

<script>
import Main from './Main'
import ActiveNewsItem from './ActiveNewsItem'
import NewsSideBar from './NewsSideBar'
import NewsList from './NewsList'
import Drawer from './Drawer'

export default {
  name: 'app',
  data () {
    return {
      newsList: [
        { id: 0, title: "News title 0", text: "Lorem Ipsum is simply dummy text of the printing", url: "https://yesno.wtf", hover: false},
        { id: 1, title: "News title 1", text: "Lorem Ipsum is simply dummy text of the printing", url: "https://yesno.wtf", hover: false},
        { id: 2, title: "News title 2", text: "Lorem Ipsum is simply dummy text of the printing", url: "https://yesno.wtf", hover: false},
        { id: 3, title: "News title 3", text: "Lorem Ipsum is simply dummy text of the printing", url: "https://yesno.wtf", hover: false},
      ],
      activeNewsItemId: null,
      regionSelected: false,
      drawerIsOpen: false,
      dynamicComponents: {
        activeNewsItemComponent: 'activenewsitem',
        newsListComponent: 'newslist',
      },
    }
  },
  computed: {
    getNewsItemByActiveId: function() {
      const newsItem = this.newsList.find(item => item.id === this.activeNewsItemId)
      return newsItem !== undefined && 'id' in newsItem ? newsItem : null;
    }
  },
  methods: {
    toggleHover: function(news) {
      news.hover = !news.hover
    },
    toggleActive: function(news) {
      if (news.id === this.activeNewsItemId) {
        this.activeNewsItemId = null
        this.closeDrawer()
      } else {
        this.activeNewsItemId = news.id
        this.openDrawer()
      }
    },
    openDrawer: function() {
      this.drawerIsOpen = true
    },
    closeDrawer: function() {
      this.drawerIsOpen = false
      this.activeNewsItemId = null
      this.regionSelected = false
    }
  },
  components: {
    'mainsection': Main,
    'activenewsitem': ActiveNewsItem,
    'newssidebar': NewsSideBar,
    'newslist': NewsList,
    'drawer': Drawer
  }
}
</script>

<style src="../styles/App.scss" lang="scss" scoped></style>
