<template>
  <div id="drawer" class="bottom-shadow full-shadow flex-centering">
    <drawerhandle></drawerhandle>
  </div>
</template>

<script>
import DrawerHandle from './DrawerHandle';

export default {
  name: 'drawer',
  components: {
    'drawerhandle': DrawerHandle
  }
}
</script>

<style src="../styles/Drawer.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
