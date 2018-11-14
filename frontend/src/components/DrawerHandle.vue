<template>
  <div
    id="drawerhandle"
    class="flex-centering">
    <div>
      <img
        v-bind:class="{ open: isOpen, closed: !isOpen }"
        v-on:click="closeDrawer"
        v-bind:src="drawerArrows"
        v-bind:alt="drawerArrowsAlt">
    </div>
  </div>
</template>

<script>
import DrawerArrows from '../assets/DrawerArrows.png'

export default {
  name: 'drawerhandle',
  props: ['isOpen', 'closeDrawer'],
  data () {
    return {
      drawerArrows: DrawerArrows,
      drawerArrowsAlt: "Drawer Arrows"
    }
  }
}
</script>

<style src="../styles/DrawerHandle.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
