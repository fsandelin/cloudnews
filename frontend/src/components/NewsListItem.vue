<template>
  <li
    @mouseenter="toggleHover(news)"
    @mouseleave="toggleHover(news)"
    v-on:click="toggleActive(news)"
    v-bind:class="{ hover: news.hover && news.id !== activeNewsItemId,
                    active: news.id === activeNewsItemId,
                    'bottom-shadow': news.hover }"
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
  name: 'newslistitem',
  props: ['activeNewsItemId', 'news', 'toggleHover', 'toggleActive'],
}
</script>

<style src="../styles/NewsListItem.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
