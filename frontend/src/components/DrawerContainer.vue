<template>
  <div
    id="drawer"
    class="bottom-shadow flex-col">
    <slot />
    <DrawerHandle />
  </div>
</template>

<script>
import DrawerHandle from './DrawerHandle'

export default {
  name: 'DrawerContainer',
  components: {
    'DrawerHandle': DrawerHandle
  }
}
</script>

<style src="../styles/Drawer.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
