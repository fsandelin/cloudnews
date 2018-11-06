<template>
  <li
    @mouseenter="toggleActive(news)"
    @mouseleave="toggleActive(news)"
    v-bind:class="{ active: news.active }"
    class="news-item"
    v-bind:key="news.id"
    >
    <p class="title">
      {{ news.title }}
    </p>
    <p class="text">
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

<style src="../styles/SideBarNewsItem.scss" lang="scss" scoped></style>
