<template>
  <div
    id="drawerhandle"
    class="flex-col"
    :class="{ closed: !drawerIsOpen }"
    @click="toggleDrawer">
    <div>
      <img
        :src="drawerArrows"
        :alt="drawerArrowsAlt">
    </div>
  </div>
</template>

<script>
import DrawerArrows from '../../assets/DrawerArrows.png'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Drawerhandle',
  data () {
    return {
      drawerArrows: DrawerArrows,
      drawerArrowsAlt: 'Drawer Arrows'
    }
  },
  computed: {
    ...mapGetters([
      'activeNewsItemId',
      'selectedCounty'
    ]),
    drawerIsOpen: function () {
      return this.activeNewsItemId !== null || this.selectedCounty !== null
    }
  },
  methods: {
    ...mapActions([
      'toggleDrawer'
    ])
  }
}
</script>

<style src="./DrawerHandle.scss" lang="scss" scoped></style>
