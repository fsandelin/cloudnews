<template>
  <div>
    <p class="title flex-centering">
      {{ getNewsItemByActiveId.title }}
    </p>
    <p class="text flex-centering">
      {{ getNewsItemByActiveId.text }}
    </p>
    <p class="text flex-centering">
      {{ getNewsItemByActiveId.url }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'activenewsitem',
  props: ['getNewsItemByActiveId'],
}
</script>

<style src="../styles/ActiveNewsItem.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
