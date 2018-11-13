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
        v-if="selectedRegion !== null && getNewsItemByActiveId === null"
        v-bind:selectedRegion="selectedRegion"
        v-bind:newsList="newsList"
        v-bind:activeNewsItemId="activeNewsItemId"
        v-bind:toggleHover="toggleHover"
        v-bind:toggleActive="toggleActive"
        v-bind:is="dynamicComponents.drawerNewsList">
      </component>
    </drawer>
  </div>
</template>

<script>
import Main from './Main'
import ActiveNewsItem from './ActiveNewsItem'
import NewsSideBar from './NewsSideBar'
import Drawer from './Drawer'
import DrawerNewsList from './DrawerNewsList';

export default {
  name: 'app',
  data () {
    return {
      newsList: [
        { id: 0, title: "News title 0", text: "Lorem Ipsum is simply dummy text of the printing", url: "https://yesno.wtf"},
        { id: 1, title: "News title 1", text: "Lorem Ipsum is simply dummy text of the printing", url: "https://yesno.wtf"},
        { id: 2, title: "News title 2", text: "Lorem Ipsum is simply dummy text of the printing", url: "https://yesno.wtf"},
        { id: 3, title: "News title 3", text: "Lorem Ipsum is simply dummy text of the printing", url: "https://yesno.wtf"},
      ],
      activeNewsItemId: null,
      selectedRegion: "Some selected region",
      dynamicComponents: {
        activeNewsItemComponent: 'activenewsitem',
        newsListComponent: 'newslist',
        drawerNewsList: 'drawernewslist'
      },
    }
  },
  computed: {
    getNewsItemByActiveId: function() {
      const newsItem = this.newsList.find(item => item.id === this.activeNewsItemId)
      return newsItem !== undefined && 'id' in newsItem ? newsItem : null;
    },
    drawerIsOpen: function () {
      return this.activeNewsItemId !== null || this.selectedRegion !== null
    }
  },
  methods: {
    toggleHover: function(news) {
      news.hover = !news.hover
    },
    toggleActive: function(news) {
      if (news.id === this.activeNewsItemId) {
        this.closeDrawer()
      } else {
        this.activeNewsItemId = news.id
      }
    },
    closeDrawer: function() {
      this.activeNewsItemId = null
      this.selectedRegion = null
    }
  },
  components: {
    'mainsection': Main,
    'activenewsitem': ActiveNewsItem,
    'newssidebar': NewsSideBar,
    'drawer': Drawer,
    'drawernewslist': DrawerNewsList
  }
}
</script>

<style src="../styles/App.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
