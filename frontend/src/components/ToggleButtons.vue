<template>
  <div class="toggle-buttons flex-centering">
    <togglebutton
      v-for="item in items"
      v-bind:key="item.text"
      v-bind:item="item">
    </togglebutton>
  </div>
</template>

<script>
import ToggleButton from './ToggleButton'

const item = {
  active: false,
  toggleActive: (item) => item.active = !item.active
}

export default {
  name: 'togglebuttons',
  data () {
    return {
      items: [
        { ...item, text: 'SVT' },
        { ...item, text: 'TT' }
      ]
    }
  },
  components: {
    'togglebutton': ToggleButton
  }
}
</script>

<style src="../styles/ToggleButtons.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>

