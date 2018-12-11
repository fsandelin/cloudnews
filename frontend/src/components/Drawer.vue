<template>
  <div
    id="drawer"
    class="bottom-shadow flex-col">
    <slot />
    <DrawerHandle
      :isOpen="isOpen"
      :toggleDrawer="toggleDrawer" />
  </div>
</template>

<script>
import DrawerHandle from './DrawerHandle'

export default {
  name: 'Drawer',
  components: {
    'DrawerHandle': DrawerHandle
  },
  props: ['toggleDrawer', 'isOpen']
}
</script>

<style src="../styles/Drawer.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
