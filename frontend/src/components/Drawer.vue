<template>
  <div
    id="drawer"
    class="bottom-shadow flex-col">
    <slot></slot>
    <drawerhandle
      v-bind:isOpen="isOpen"
      v-bind:toggleDrawer="toggleDrawer">
    </drawerhandle>
  </div>
</template>

<script>
import DrawerHandle from './DrawerHandle';

export default {
  name: 'drawer',
  props: ['toggleDrawer', 'isOpen'],
  components: {
    'drawerhandle': DrawerHandle,
  }
}
</script>

<style src="../styles/Drawer.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
