<template>
  <div class="toggle-buttons flex-row">
    <ToggleButton
      v-for="item in items"
      :key="item.name"
      :item="item"
      :toggleActive="toggleActive" />
  </div>
</template>

<script>
import ToggleButton from './ToggleButton'

export default {
  name: 'Togglebuttons',
  components: {
    'ToggleButton': ToggleButton
  },
  props: ['items', 'toggleActive']
}
</script>

<style src="./ToggleButtons.scss" lang="scss" scoped></style>
<style src="../../styles/Commons.scss" lang="scss" scoped></style>
