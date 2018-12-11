<template>
  <div
    id="drawerhandle"
    class="flex-col"
    :class="{ closed: !isOpen }"
    @click="toggleDrawer">
    <div>
      <img
        :src="drawerArrows"
        :alt="drawerArrowsAlt">
    </div>
  </div>
</template>

<script>
import DrawerArrows from '../assets/DrawerArrows.png'

export default {
  name: 'Drawerhandle',
  props: ['isOpen', 'toggleDrawer'],
  data () {
    return {
      drawerArrows: DrawerArrows,
      drawerArrowsAlt: 'Drawer Arrows'
    }
  }
}
</script>

<style src="../styles/DrawerHandle.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
