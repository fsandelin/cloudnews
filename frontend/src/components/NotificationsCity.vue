<template>
  <g id="notificationsCity">
  </g>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "notificationsCity",
  props: ['circleSize', 'fontSize', 'yOffset']
}
</script>

<style src="../styles/NotificationsCity.scss" lang="scss" scoped></style>