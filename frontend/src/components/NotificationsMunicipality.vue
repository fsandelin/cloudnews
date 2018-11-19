<template>
  <g id="notificationsMunicipality">
    <circle
      class="circle-municipality"
      v-for="municipality of newsByMunicipality"
      v-bind:key="'newsNotification'+municipality.name"
      v-bind:cx="selectedCounty !== municipality.county ? municipality.countyX : municipality.x +'px'"
      v-bind:cy="selectedCounty !== municipality.county ? municipality.countyY : municipality.y +'px'"
      v-bind:r="circleSize(municipality.news.length)+'px'">
    </circle>
    <transition-group name="fade" tag="g">
      <text
        class="circle-number"
        v-if="municipality.county === selectedCounty"
        v-for="municipality of newsByMunicipality"
        v-bind:key="'newsNotificationText'+municipality.name+municipality.news.id"
        v-show="municipality.active"
        text-anchor="middle"
        v-bind:x="municipality.x+'px'"
        v-bind:y="municipality.y+'px'"
        v-bind:dy="yOffset(municipality.news.length)+'px'"
        v-bind:font-size="fontSize(municipality.news.length)+'px'">
        {{municipality.news.length}}
      </text>
    </transition-group>
  </g>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "notificationsMunicipality",
  props: ['circleSize', 'fontSize', 'yOffset'],
  computed: {
    ...mapGetters([
      'selectedCounty',
      'newsByMunicipality'
    ])
  },
}
</script>

<style src="../styles/MapNotifications.scss" lang="scss" scoped></style>