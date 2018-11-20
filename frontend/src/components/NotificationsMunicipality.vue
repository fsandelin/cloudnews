<template>
  <g id="notificationsMunicipality">
    <line
      v-for="municipality of newsByMunicipality"
      v-bind:key="'municipalityLine'+municipality.name"
      v-show="municipality.active"
      v-bind:x1="municipality.countyX+'px'"
      v-bind:y1="municipality.countyY+'px'"
      v-bind:x2="municipality.x+'px'"
      v-bind:y2="municipality.y+'px'"
      v-bind:stroke-width="lineWidth()+'px'">
    </line>
    <circle
      class="municipality-circle"
      v-for="municipality of newsByMunicipality"
      v-bind:key="'newsNotification'+municipality.name"
      v-bind:cx="selectedCounty !== municipality.county ? municipality.countyX : municipality.x +'px'"
      v-bind:cy="selectedCounty !== municipality.county ? municipality.countyY : municipality.y +'px'"
      v-bind:r="circleSize(municipality.news.length)+'px'">
    </circle>
    <transition-group name="fade" tag="g">
      <text
        class="municipality-number"
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
      'newsByMunicipality',
      'getZoomValue'
    ])
  },
  methods: {
    lineWidth: function() {
      return 1.0 * (1/Math.max(this.getZoomValue/2.5, 1.0));
    }
  }
}
</script>

<style src="../styles/NotificationsMunicipality.scss" lang="scss" scoped></style>