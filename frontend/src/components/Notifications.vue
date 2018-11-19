<template>
  <g id="notifications">
    <notificationsCity
      v-bind:circleSize="circleSize"
      v-bind:fontSize="fontSize"
      v-bind:yOffset="yOffset">
    </notificationsCity>

    <notificationsMunicipality
      v-bind:circleSize="circleSize"
      v-bind:fontSize="fontSize"
      v-bind:yOffset="yOffset">
    </notificationsMunicipality>

    <notificationsCounty
      v-bind:circleSize="circleSize"
      v-bind:fontSize="fontSize"
      v-bind:yOffset="yOffset">
    </notificationsCounty>

    <notificationsCountry
      v-bind:circleSize="circleSize"
      v-bind:fontSize="fontSize"
      v-bind:yOffset="yOffset">
    </notificationsCountry>
  </g>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import NotificationsCity from './NotificationsCity';
import NotificationsMunicipality from './NotificationsMunicipality';
import NotificationsCounty from './NotificationsCounty';
import NotificationsCountry from './NotificationsCountry';


export default {
  name: "notifications",
  components: {
    'notificationsCity': NotificationsCity,
    'notificationsMunicipality': NotificationsMunicipality,
    'notificationsCounty': NotificationsCounty,
    'notificationsCountry': NotificationsCountry
  },
  computed: {
    ...mapGetters([
      'getZoomValue',
    ])
  },
  methods: {
    circleSize: function (length) {
      return (4+(length/2)) * (1/Math.max(this.getZoomValue/2.5, 1.0));
    },
    fontSize: function (length) {
      return (4+(length/2)) * (1/Math.max(this.getZoomValue/2.5, 1.0));
    },
    yOffset: function (length) {
      return (4+(length/2))/3 * (1/Math.max(this.getZoomValue/2.5, 1.0));
    }
  }
}
</script>

<style src="../styles/MapNotifications.scss" lang="scss" scoped></style>
