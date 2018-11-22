<template>
  <div class="toggle-button">
    <div
      class="background flex-centering"
      v-bind:class="{ active: active }"
      v-on:click="toggleActive">
      <div class="circle full-shadow"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'togglebutton',
  data () {
    return {
      active: false
    }
  },
  methods: {
    toggleActive: function() {
      this.active = !this.active
    }
  }
}
</script>

<style src="../styles/ToggleButton.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
