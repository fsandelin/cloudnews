<template>
  <div class="toggle-button flex-col">
    <span class="text">
      {{ item.name }}
    </span>
    <div
      class="background flex-col"
      :class="{ active: item.active }"
      @click="toggleActive(item)">
      <div class="circle full-shadow" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Togglebutton',
  props: ['item', 'toggleActive']
}
</script>

<style src="./ToggleButton.scss" lang="scss" scoped></style>
<style src="../../styles/Commons.scss" lang="scss" scoped></style>
