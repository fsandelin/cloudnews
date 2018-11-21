<template>
  <g id="notificationsCountry">
  </g>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "notificationsCountry",
  props: ['circleSize', 'fontSize', 'yOffset']
}
</script>

<style src="../styles/NotificationsCountry.scss" lang="scss" scoped></style>