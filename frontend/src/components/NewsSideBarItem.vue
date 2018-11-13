<template>
  <li
    @mouseenter="toggleActive(news)"
    @mouseleave="toggleActive(news)"
    v-bind:class="{ active: news.active, 'bottom-shadow': news.active }"
    class="news-item flex-centering light-border-bottom"
    v-bind:key="news.id"
    >
    <p class="title flex-centering">
      {{ news.title }}
    </p>
    <p class="text flex-centering">
      {{ news.text }}
    </p>
    </li>
</template>

<script>
export default {
  name: 'newsitem',
  props: ['news', 'toggleActive'],
}
</script>

<style src="../styles/NewsSideBarItem.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
