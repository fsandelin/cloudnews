<template>
  <div id="active-news-item">
    <div class="header flex-row">
      <i
        class="material-icons back"
        @click="setActiveNewsItemId(null)">
        reply
      </i>
      <p class="title">
        {{ activeNewsItem.title }}
      </p>
      <i
        class="material-icons url"
        :class="{ exists: activeNewsItem.url }"
        @click="() => activeNewsItem.url ? openLink() : null">
        {{ activeNewsItem.url ? 'link' : 'link_off' }}
      </i>
    </div>
    <p class="flex-col">
      {{ activeNewsItem.lead ? activeNewsItem.lead : activeNewsItem.body }}
    </p>
    <img
      v-if="activeNewsItem.imgurl"
      :src="activeNewsItem.imgurl">
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Drawernewsitem',
  computed: {
    ...mapGetters([
      'activeNewsItem'
    ])
  },
  methods: {
    ...mapActions([
      'setActiveNewsItemId'
    ]),
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
