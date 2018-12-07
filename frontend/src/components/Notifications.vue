<template>
  <g id="notifications">
    <notificationsCity
      v-bind:circleSize="circleSize"
      v-bind:fontSize="fontSize"
      v-bind:yOffset="yOffset"
      v-bind:lineWidth="lineWidth"
      v-bind:strokeWidth="strokeWidth">
    </notificationsCity>

    <notificationsMunicipality
      v-bind:calculateNewsLengthForObjects="calculateNewsLengthForObjects"
      v-bind:updateNewsLengthForObjects="updateNewsLengthForObjects"
      v-bind:circleSize="circleSize"
      v-bind:fontSize="fontSize"
      v-bind:yOffset="yOffset"
      v-bind:lineWidth="lineWidth">
    </notificationsMunicipality>

    <notificationsCounty
      v-bind:calculateNewsLengthForObjects="calculateNewsLengthForObjects"
      v-bind:updateNewsLengthForObjects="updateNewsLengthForObjects"
      v-bind:circleSize="circleSize"
      v-bind:fontSize="fontSize"
      v-bind:yOffset="yOffset"
      v-bind:strokeWidth="strokeWidth">
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
    updateNewsLengthForObjects: function (list, lenList, refs, refPrefix) {
      list.map(obj => {
        if (!(lenList.map(m => m.name).includes(obj.name))){
          lenList.push({name: obj.name, length: obj.news.length});
        }

        lenList.map(prevObj => {
          if (obj.name === prevObj.name &&
              obj.news.length !== prevObj.length) {
                const el = refs[`${refPrefix}${obj.name}`];
                this.animate(el);
                prevObj.length = obj.news.length;
              }
        });
      })
    },
    calculateNewsLengthForObjects: function (list) {
      return list.map(obj => ({
        name: obj.name, length: obj.news.length
      }))
    },
    animate: function(el) {
      let r = parseFloat(el[0].attributes.getNamedItem("r").value, 10);
      Velocity(el,  { r: r*1.5 }, { duration: 80 });
      Velocity(el,  { r: r }, { duration: 40 });
    },
    lineWidth: function() {
      return 1.0 * (1/Math.max(this.zoomValue/2.5, 1.0));
    },
    circleSize: function (length) {
      return Math.min(12,(10+(length/7))) * (1/Math.max(this.zoomValue/1.5, 1.0));
    },
    fontSize: function (length) {
      return Math.min(13,(11+(length/7))) * (1/Math.max(this.zoomValue/1.5, 1.0));
    },
    yOffset: function (length) {
      return Math.min(13,(11+(length/7))/3) * (1/Math.max(this.zoomValue/1.5, 1.0));
    },
    strokeWidth: function() {
      return 1.0 * (1/Math.max(this.zoomValue/2.5, 1.0));
    },
  }
}
</script>

<style src="../styles/Notifications.scss" lang="scss" scoped></style>
