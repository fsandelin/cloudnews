<template>
  <div id="active-news-item">
    <p class="title flex-centering">
      {{ activeNewsItem.title }}
    </p>
    <p class="text flex-centering">
      {{ activeNewsItem.text }}
    </p>
    <p class="text flex-centering">
      {{ activeNewsItem.url }}
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
    ...mapGetters(['activeNewsItem'])
  }
}
</script>

<style src="../styles/DrawerNewsItem.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
