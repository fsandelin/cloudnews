<template>
  <div id="active-news-item">
    <div class="header flex-centering">
      <p class="title">
        {{ activeNewsItem.title }}
      </p>
      <i class="material-icons"
        v-on:click="() => activeNewsItem.url ? openLink : null"
        v-bind:class="{ url: activeNewsItem.url }">
        {{ activeNewsItem.url ? 'link' : 'link_off' }}
      </i>
    </div>
    <p class="flex-centering">
      {{ activeNewsItem.lead }}
    </p>
    <img
      v-bind:src="activeNewsItem.imgurl"
      v-if="activeNewsItem.imgurl">
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'drawernewsitem',
  computed: {
    ...mapGetters([
      'activeNewsItem'
    ])
  },
  methods: {
    openLink: function () {
      if (this.activeNewsItem.url.startsWith('http')) {
        window.open(this.activeNewsItem.url, '_blank')
      } else {
        window.open(`https://${this.activeNewsItem.url}`, '_blank')
      }
    }
  }
}
</script>

<style src="../styles/DrawerNewsItem.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
