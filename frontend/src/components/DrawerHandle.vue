<template>
  <div
    id="drawerhandle"
    class="flex-centering"
    v-on:click="toggleDrawer"
    v-bind:class="{ closed: !isOpen }">
    <div>
      <img
        v-bind:src="drawerArrows"
        v-bind:alt="drawerArrowsAlt">
    </div>
  </div>
</template>

<script>
import DrawerArrows from '../assets/DrawerArrows.png'

export default {
  name: 'drawerhandle',
  props: ['isOpen', 'toggleDrawer'],
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
