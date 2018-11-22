<template>
  <div class="toggle-buttons">
    <togglebutton></togglebutton>
  </div>
</template>

<script>
import ToggleButton from './ToggleButton'

export default {
  name: 'togglebuttons',
  components: {
    'togglebutton': ToggleButton
  }
}
</script>

<style src="../styles/ToggleButtons.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
