<template>
  <g id="notifications">
    <notificationsCity
      v-bind:circleSize="circleSize"
      v-bind:fontSize="fontSize"
      v-bind:yOffset="yOffset">
    </notificationsCity>

    <notificationsMunicipality
      v-bind:calculateNewsLengthForObjects="calculateNewsLengthForObjects"
      v-bind:circleSize="circleSize"
      v-bind:fontSize="fontSize"
      v-bind:yOffset="yOffset">
    </notificationsMunicipality>

    <notificationsCounty
      v-bind:calculateNewsLengthForObjects="calculateNewsLengthForObjects"
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
import NotificationsCity from './NotificationsCity';
import NotificationsMunicipality from './NotificationsMunicipality';
import NotificationsCounty from './NotificationsCounty';
import NotificationsCountry from './NotificationsCountry';
import { mapGetters, mapActions } from 'vuex';

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
      'zoomValue',
    ])
  },
  methods: {
    calculateNewsLengthForObjects: function (list) {
      return list.map(obj => ({
        name: obj.name, length: obj.news.length
      }))
    },
    circleSize: function (length) {
      return Math.min(9,(4+(length/7))) * (1/Math.max(this.zoomValue/2.5, 1.0));
    },
    fontSize: function (length) {
      return Math.min(10,(5+(length/7))) * (1/Math.max(this.zoomValue/2.5, 1.0));
    },
    yOffset: function (length) {
      return Math.min(10,(5+(length/7))/3) * (1/Math.max(this.zoomValue/2.5, 1.0));
    },
  }
}
</script>
