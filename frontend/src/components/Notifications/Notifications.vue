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
      :strokeWidth="strokeWidth"
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
      :calculateNewsLengthForObjects="calculateNewsLengthForObjects"
      :updateNewsLengthForObjects="updateNewsLengthForObjects"
      :circleSize="circleSize"
      :fontSize="fontSize"
      :yOffset="yOffset"
      :strokeWidth="strokeWidth" />

    <NotificationsCountry
      :circleSize="circleSize"
      :fontSize="fontSize"
      :yOffset="yOffset" />
  </g>
</template>

<script>
import NotificationsCity from './NotificationsCity'
import NotificationsMunicipality from './NotificationsMunicipality'
import NotificationsCounty from './NotificationsCounty'
import Velocity from 'velocity-animate'
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
      'newsByMunicipality'
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
      'municipalityClick'
    ]),
    updateNewsLengthForObjects: function (list, lenList, refs, refPrefix) {
      list.map(obj => {
        if (!(lenList.map(m => m.name).includes(obj.name))) {
          lenList.push({ name: obj.name, length: obj.news.length })
        }

        lenList.map(prevObj => {
          if (obj.name === prevObj.name && obj.news.length !== prevObj.length) {
            const el = refs[`${refPrefix}${obj.name}`]
            this.animate(el)
            prevObj.length = obj.news.length
          }
        })
      })
    },
    calculateNewsLengthForObjects: function (list) {
      return list.map(obj => ({
        name: obj.name, length: obj.news.length
      }))
    },
    animate: function (el) {
      let r = parseFloat(el[0].attributes.getNamedItem('r').value, 10)
      Velocity(el, { r: r * 1.5 }, { duration: 80 })
      Velocity(el, { r: r }, { duration: 40 })
    },
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
