<template>
  <div class="toggle-button">
    <span class="text">{{ item.text }}</span>
    <div
      class="background flex-centering"
      v-bind:class="{ active: item.active }"
      v-on:click="item.toggleActive(item)">
      <div class="circle full-shadow"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'togglebutton',
  props: ['item'],
}
</script>

<style src="../styles/ToggleButton.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
