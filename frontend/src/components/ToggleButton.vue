<template>
  <div class="toggle-button">
    <span class="text">{{ item.name.toUpperCase() }}</span>
    <div
      class="background flex-col"
      v-bind:class="{ active: item.active }"
      v-on:click="toggleActive(item)">
      <div class="circle full-shadow"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'togglebutton',
  props: ['item', 'toggleActive'],
}
</script>

<style src="../styles/ToggleButton.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
