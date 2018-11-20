<template>
  <g id="mapNotifications">
    <circle
      class="circle-municipality"
      v-for="municipality of newsByMunicipality"
      v-bind:key="'newsNotification'+municipality.name"
      v-bind:cx="selectedCounty !== municipality.county ? municipality.countyX : municipality.x +'px'"
      v-bind:cy="selectedCounty !== municipality.county ? municipality.countyY : municipality.y +'px'"
      v-bind:r="circleSize(municipality.news.length)+'px'">
    </circle>
    <circle
      class="circle-county"
      v-for="county of newsByCounty"
      v-bind:key="'countyNewsNotification'+county.name"
      v-show="county.active"
      v-bind:cx="county.x+'px'"
      v-bind:cy="county.y+'px'"
      v-bind:r="circleSize(county.news.length)+'px'">
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
    <text
      class="circle-number"
      v-for="county of newsByCounty"
      v-bind:key="'countyNewsNotificationText'+county.name"
      v-show="county.active"
      text-anchor="middle"
      v-bind:x="county.x+'px'"
      v-bind:y="county.y+'px'"
      v-bind:dy="yOffset(county.news.length)+'px'"
      v-bind:font-size="fontSize(county.news.length)+'px'">
      {{county.news.length}}
    </text>
    </transition-group>
  </g>
</template>

<script>
import { mapGetters } from 'vuex';
import { getters as g } from '../store/constants'

export default {
  name: "mapNotifications",
  computed: {
    ...mapGetters([
      g.SELECTED_COUNTY,
      g.NEWS_BY_COUNTY,
      g.NEWS_BY_MUNICIPALITY,
      g.ZOOM_VALUE
    ])
  },
  methods: {
    circleSize: function (length) {
      return (4+(length/2)) * (1/Math.max(this.zoomValue/2.5, 1.0));
    },
    fontSize: function (length) {
      return (4+(length/2)) * (1/Math.max(this.zoomValue/2.5, 1.0));
    },
    yOffset: function (length) {
      return (4+(length/2))/3 * (1/Math.max(this.zoomValue/2.5, 1.0));
    }
  }
}
</script>

<style src="../styles/MapNotifications.scss" lang="scss" scoped></style>
