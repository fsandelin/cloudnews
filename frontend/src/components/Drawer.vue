<template>
  <div
    id="drawer"
    class="bottom-shadow full-shadow flex-centering">
    <slot></slot>
    <drawerhandle
      v-bind:isOpen="isOpen"
      v-bind:closeDrawer="closeDrawer">
    </drawerhandle>
  </div>
</template>

<script>
import DrawerHandle from './DrawerHandle';

export default {
  name: 'drawer',
  props: ['closeDrawer', 'isOpen'],
  components: {
    'drawerhandle': DrawerHandle,
  }
}
</script>

<style src="../styles/Drawer.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
