<template>
  <g id="notifications">
    <NotificationsCity
      v-for="city in activeCities"
      :key="'cityNotification'+city.name"
      :city="city"
      :circleSize="circleSize"
      :fontSize="fontSize"
      :yOffset="yOffset"
      :lineWidth="lineWidth"
      @onClick="cityClick(city)" />

    <NotificationsMunicipality
      v-for="municipality in activeMunicipalities"
      :key="'municipalityNoticication-'+municipality.name"
      :municipality="municipality"
      :circleSize="circleSize"
      :fontSize="fontSize"
      :yOffset="yOffset"
      :lineWidth="lineWidth"
      @click="municipalityClick(municipality)" />

    <NotificationsCounty
      v-for="county in newsByCounty"
      :key="'countyNoticication-'+county.name"
      :county="county"
      :circleSize="circleSize"
      :fontSize="fontSize"
      :yOffset="yOffset"
      :strokeWidth="strokeWidth"
      @click="countyClick(county)" />
  </g>
</template>

<script>
import NotificationsCity from './NotificationsCity'
import NotificationsMunicipality from './NotificationsMunicipality'
import NotificationsCounty from './NotificationsCounty'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Notifications',
  components: {
    'NotificationsCity': NotificationsCity,
    'NotificationsMunicipality': NotificationsMunicipality,
    'NotificationsCounty': NotificationsCounty
  },
  computed: {
    ...mapGetters([
      'zoomValue',
      'newsByCity',
      'newsByMunicipality',
      'newsByCounty'
    ]),
    activeCities: function () {
      return this.newsByCity.filter(city => city.active)
    },
    activeMunicipalities: function () {
      return this.newsByMunicipality.filter(city => city.active)
    },
    lineWidth: function () {
      return 1.0 * (1 / Math.max(this.zoomValue / 2.5, 1.0))
    },
    strokeWidth: function () {
      return 1.0 * (1 / Math.max(this.zoomValue / 2.5, 1.0))
    }
  },
  methods: {
    ...mapActions([
      'cityClick',
      'municipalityClick',
      'countyClick'
    ]),
    circleSize: function (length) {
      return Math.min(12, (10 + (length / 7))) * (1 / Math.max(this.zoomValue / 1.5, 1.0))
    },
    fontSize: function (length) {
      return Math.min(13, (11 + (length / 7))) * (1 / Math.max(this.zoomValue / 1.5, 1.0))
    },
    yOffset: function (length) {
      return Math.min(13, (11 + (length / 7)) / 3) * (1 / Math.max(this.zoomValue / 1.5, 1.0))
    }
  }
}
</script>

<style src="./Notifications.scss" lang="scss" scoped></style>
