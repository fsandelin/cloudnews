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
