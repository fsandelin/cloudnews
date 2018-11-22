<template>
  <div class="toggle-buttons flex-centering">
    <togglebutton
      v-for="item in items"
      v-bind:key="item.name"
      v-bind:item="item"
      v-bind:toggleActive="toggleActive">
    </togglebutton>
  </div>
</template>

<script>
import ToggleButton from './ToggleButton'

export default {
  name: 'togglebuttons',
  props: ['items', 'toggleActive'],
  components: {
    'togglebutton': ToggleButton
  }
}
</script>

<style src="../styles/ToggleButtons.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>

